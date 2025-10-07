use super::etterna::{rating_new, Proportion};
use crate::core::react::Rating;

pub fn create_sunny_rating(osu_map: &str, proportions: &Proportion) -> Rating {
    let sunny_rating_value = get_sunnyxxy_rating(osu_map);
    rating_new(
        "sunnyxxy".to_string(),
        sunny_rating_value,
        proportions.clone(),
    )
}

pub fn get_sunnyxxy_rating(osu_map: &str) -> f64 {
    match ssrrr::preprocess(osu_map, "None") {
        Ok(preprocess) => {
            match ssrrr::algorithm::process::process::calculate(&preprocess) {
                Ok(result) => result.rating,
                Err(_) => 0.0,
            }
        }
        Err(_) => 0.0,
    }
}
