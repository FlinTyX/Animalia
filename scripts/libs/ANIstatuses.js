module.exports = {
    poisoned: extend(StatusEffect, "dart-poisoned", {
        damage: 1.25,
        color: Pal.accent,
        speedMultiplier: 0.9,
        damageMultiplier: 0.4,
        healthMultiplier: 0.82,
        buildSpeedMultiplier: 0.06,
        dragMultiplier: 0.8,
        
        show: true,

        init(){
            this.super$init();
      
            this.opposite(StatusEffects.wet, StatusEffects.muddy);
        },
        load(){
            this.super$load();
            this.region = Core.atlas.find(this.name);
        },
        icons(){
            return this.region;
        },
        isHidden(){
            return false;
        },
        draw(unit){
            if(!unit.type.animalType){

                Draw.z(Layer.groundUnit + 1);
                Draw.mixcol(Pal.accent, Mathf.absin(2, 0.65));

                Draw.rect(unit.type.fullIcon, unit.x, unit.y, unit.rotation - 90);

                Draw.reset();

            } else unit.applyMixcol(Pal.accent, Mathf.absin(2, 0.65));
        }
    })
}