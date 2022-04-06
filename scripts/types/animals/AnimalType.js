function AnimalType(name, object){
    this.name = name;

    return extend(UnitType, this.name, Object.assign({
        registeredId: -1,
 
        animalType(){
            return AnimalType;
        },
        getEgg(){
            if(this.eggType == undefined){
                this.eggType = Vars.content.getByName(ContentType.item, this.name + "-egg");
            }

            return this.eggType;
        },
        regId(){
            return this.registeredId;
        },
        register(){
            this.registeredId = EntityMapping.register(this.name, this.constructor);
        },
        init(){
            this.super$init();
            this.register();

            this.range = object.range ? object.range : this.range;
        },
        reStats(){
            
        },
        setStats(){
            this.super$setStats();
            this.reStats();
        }
    }, object));
}

function AnimalEntity(){
    //class, type, object
    return extend(arguments[0], Object.assign({
        classId: () => arguments[1].regId(),

        color: null,
        drawc: {run: () => {}},

        colorBegin(){
            if(this.color) this.drawc.run();
        },
        colorEnd(){
            if(this.color){
                this.color = null;
            }

            Draw.reset();
        },
        applyMixcol(color, alpha){
            this.color = color;
            this.drawc.run = () => Draw.mixcol(this.color, alpha);
        },
        applyColor(color){
            this.color = color;
            this.drawc.run = () => Draw.color(this.color);
        }
    }, arguments[2]));
}

module.exports = {
    AnimalType : AnimalType,
    AnimalEntity : AnimalEntity
}