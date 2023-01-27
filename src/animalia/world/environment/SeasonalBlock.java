package animalia.world.environment;

import animalia.world.Season;

public interface SeasonalBlock {
    Season season = Season.none;

    default Season season(){
        return season;
    }
}
