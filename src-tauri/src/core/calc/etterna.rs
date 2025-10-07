use super::osu::get_star_rating;
use crate::core::react::{ManiaRating, ModeRating, Rates, Rating};
use anyhow::Result;
use rosu_map::Beatmap as RmBeatmap;
use minacalc_rs::{hashmap::HashMapCalcExt, OsuCalcExt, Calc, Ssr};
use std::fs;
use std::str::FromStr;

pub struct RatesMaker {
    pub rate: String,
    pub drain_time: f64,
    pub total_time: f64,
    pub bpm: f32,
    pub skillset_scores: Ssr,
    pub osu_map: RmBeatmap,
}

#[derive(Clone)]
pub struct Proportion {
    pub stream: f64,
    pub jumpstream: f64,
    pub handstream: f64,
    pub stamina: f64,
    pub jackspeed: f64,
    pub chordjack: f64,
    pub technical: f64,
}

pub async fn rates_from_skillset_scores(make_rates: &mut RatesMaker) -> Result<Rates> {
    let rate_data = calculate_rate_data(make_rates);
    let proportions = calculate_proportions(make_rates);
    let osu_map = encode_beatmap_to_string(make_rates);
    let osu_hash = generate_beatmap_hash(&osu_map);
    let ratings = create_all_ratings(make_rates, &proportions, &osu_map);

    let rates = Rates {
        id: None,
        osu_hash: Some(osu_hash),
        centirate: rate_data.centirate,
        drain_time: rate_data.drain_time as f64,
        total_time: rate_data.total_time as f64,
        bpm: rate_data.bpm as f64,
        rating: ratings,
    };

    Ok(rates)
}

#[derive(Debug)]
struct RateData {
    centirate: i32,
    drain_time: i32,
    total_time: i32,
    bpm: f32,
}

fn calculate_rate_data(make_rates: &RatesMaker) -> RateData {
    let rate = make_rates.rate.parse::<f64>().unwrap();
    let centirate = rate * 100.0;
    let proportion_rate = 100.0 / centirate;
    let drain_time = make_rates.drain_time * proportion_rate;
    let total_time = make_rates.total_time * proportion_rate;
    let bpm = make_rates.bpm as f64 * rate;

    RateData {
        centirate: centirate as i32,
        drain_time: drain_time as i32,
        total_time: total_time as i32,
        bpm: bpm as f32,
    }
}

fn calculate_proportions(make_rates: &RatesMaker) -> Proportion {
    let overall = make_rates.skillset_scores.overall as f64;

    Proportion {
        stream: make_rates.skillset_scores.stream as f64 / overall,
        jumpstream: make_rates.skillset_scores.jumpstream as f64 / overall,
        handstream: make_rates.skillset_scores.handstream as f64 / overall,
        stamina: make_rates.skillset_scores.stamina as f64 / overall,
        jackspeed: make_rates.skillset_scores.jackspeed as f64 / overall,
        chordjack: make_rates.skillset_scores.chordjack as f64 / overall,
        technical: make_rates.skillset_scores.technical as f64 / overall,
    }
}

fn encode_beatmap_to_string(make_rates: &RatesMaker) -> String {
    make_rates.osu_map.clone().encode_to_string().unwrap()
}

fn generate_beatmap_hash(osu_map: &str) -> String {
    hash_md5(osu_map).unwrap()
}

fn hash_md5(content: &str) -> Result<String> {
    let digest = md5::compute(content.as_bytes());
    Ok(format!("{:x}", digest))
}

fn create_all_ratings(
    make_rates: &RatesMaker,
    proportions: &Proportion,
    osu_map: &str,
) -> Vec<Rating> {
    let etterna_rating = create_etterna_rating(make_rates);
    let osu_rating = create_osu_rating(osu_map, proportions);

    vec![etterna_rating, osu_rating]
}

fn create_etterna_rating(make_rates: &RatesMaker) -> Rating {
    Rating {
        id: None,
        rates_id: None,
        rating: make_rates.skillset_scores.overall as f64,
        rating_type: "etterna".to_string(),
        mode_rating: ModeRating::Mania {
            Mania: ManiaRating {
                id: None,
                stream: make_rates.skillset_scores.stream as f64,
                jumpstream: make_rates.skillset_scores.jumpstream as f64,
                handstream: make_rates.skillset_scores.handstream as f64,
                stamina: make_rates.skillset_scores.stamina as f64,
                jackspeed: make_rates.skillset_scores.jackspeed as f64,
                chordjack: make_rates.skillset_scores.chordjack as f64,
                technical: make_rates.skillset_scores.technical as f64,
            },
        },
    }
}

fn create_osu_rating(osu_map: &str, proportions: &Proportion) -> Rating {
    let stars = get_star_rating(osu_map);
    rating_new("osu".to_string(), stars, proportions.clone())
}

pub fn rating_new(rating_type: String, rating: f64, proportion: Proportion) -> Rating {
    Rating {
        id: None,
        rates_id: None,
        rating: rating as f64,
        rating_type,
        mode_rating: ModeRating::Mania {
            Mania: ManiaRating {
                id: None,
                stream: (rating * proportion.stream) as f64,
                jumpstream: (rating * proportion.jumpstream) as f64,
                handstream: (rating * proportion.handstream) as f64,
                stamina: (rating * proportion.stamina) as f64,
                jackspeed: (rating * proportion.jackspeed) as f64,
                chordjack: (rating * proportion.chordjack) as f64,
                technical: (rating * proportion.technical) as f64,
            },
        },
    }
}

pub(crate) async fn process_beatmap(
    calc: &Calc,
    osu_path: &str,
    seconds_drain: f64,
    seconds_total: f64,
    bpm: f32,
) -> Result<(Vec<Rates>, RmBeatmap)> {
    let osu_map = fs::read_to_string(osu_path).unwrap();
    let parsed_beatmap = RmBeatmap::from_str(&osu_map).unwrap();

    let skillset_scores = calc
        .calculate_msd_from_string(osu_map.clone())?
        .as_hashmap()?;

    let mut all_rates = vec![];
    for (rate_key, skillset_scores) in skillset_scores {
        let mut rates_maker = RatesMaker {
            skillset_scores: skillset_scores,
            osu_map: parsed_beatmap.clone(),
            rate: rate_key.clone(),
            drain_time: seconds_drain,
            total_time: seconds_total,
            bpm: bpm,
        };
        let rates: Rates = rates_from_skillset_scores(&mut rates_maker).await.unwrap();
        all_rates.push(rates);
    }

    Ok((all_rates, parsed_beatmap))
}
