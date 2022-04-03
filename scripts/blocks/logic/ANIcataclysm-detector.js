const detector = module.exports = extend(Block, "cataclysm-detector", {
    configSenseable(){
        return true;
    },
    load(){
        this.super$load();
        this.topRegion = Core.atlas.find(this.name + "-top");
    }
});

detector.buildType = () => extend(Building, {
    currentWeather: null,

    setCataclysm(value){
        this.currentWeather = value;
    },
    config(){
        return this.currentWeather;
    },
    write(write){
        this.super$write(write);
        write.str(!this.currentWeather ? "null" : this.currentWeather);
    },
    read(read, revision){
        this.super$read(read, revision);
        const str = read.str();
        this.currentWeather = str.equals("null") ? null : str;
    }
});