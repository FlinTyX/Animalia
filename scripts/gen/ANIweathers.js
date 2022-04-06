const Consequences = require("types/weathers/CataclysmConsequences"),
      StormWeather = require("types/weathers/StormWeather"),
      EmberWeather = require("types/weathers/EmberWeather");

function hasWeather(){
    const args = [].slice.call(arguments);

    return Vars.state.rules.weather.select(e => args.indexOf(e.weather) != -1).size > 0;
}

function addWeather(){
    for(let i = 0; i < arguments.length; i += 2){
        if(arguments[i] && arguments[i + 1] && !hasWeather(arguments[i])){
            Vars.state.rules.weather.add(new Weather.WeatherEntry(arguments[i]));
        }
    }
}

function containsFloor(){
    const args = [].slice.call(arguments);
    let contains = false;

    Vars.world.tiles.eachTile(t => {
        if(args.indexOf(t.floor()) != -1){
            contains = true;
            return;
        }
    });

    return contains;
}

module.exports = {
    storm: new StormWeather("storm", {
        showWarning: false,

        init(){
            this.super$init();
            this.attrs.set(Attribute.light, -0.3);
            this.attrs.set(Attribute.water, 0.4);
        }
    }),

    tropicalStorm: new StormWeather("tropical-storm", {
        consequences: [new Consequences.Thunder({})],
        
        rainDensity: 450,
        rainSizeMin: 30,
        rainSizeMax: 50,

        xspeed: -12,
        yspeed: -18,
        stroke: 0.8,
        soundVol: 1,
        duration: 5 * Time.toMinutes,
        padding: 40,
        force: 8,
        density: 10000,

        init(){
            this.super$init();
            this.attrs.set(Attribute.light, -0.6);
            this.attrs.set(Attribute.water, 0.7);
        }
    }),

    volcanicEmber: new EmberWeather("volcanic-ember", {
        consequences: [new Consequences.Fire({})]
    }),

    init(){
        addWeather(
            this.storm, hasWeather(Weathers.rain, Weathers.snow),
            this.tropicalStorm, hasWeather(Weathers.rain),
            this.volcanicEmber, containsFloor(Blocks.magmarock, Blocks.slag)
        );
    }
}

Events.on(WorldLoadEvent, () => {
    Time.run(1, () => {
        if(Vars.state.isMenu() || Vars.net.client()) return;

        module.exports.init();
    });
});