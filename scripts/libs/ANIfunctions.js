module.exports = {
    uc(n){
        return Vars.content.getByName(ContentType.unit, "animalia-" + n.toString());
    },

    ic(n){
        return Vars.content.getByName(ContentType.item, "animalia-" + n.toString());
    },

    register(unit){
        return EntityMapping.register(unit.name, unit.constructor);
    },

    round(A, B){
        return Math.round(A * B) / B;
    },
    
    randomElement(arr){
        return arr[Math.floor(Math.random() * arr.length)];
    },
    
    //DEPRECATED
    around(tx, ty, range, bool){
        let arr = [];
        for(let x = -range; x < range * 2; x++){
            for(let y = -range; y < range * 2; y++){
                let t = Vars.world.tile(tx + x, ty + y);
                if(t != null && bool(t)) arr.push(t);
            }
        }
        return arr;
    },

    moving(unit){
        if(unit.controller instanceof Player){
            return !Vars.mobile ?
                Math.abs(Core.input.axis(Binding.move_x)) > 0 || 
                Math.abs(Core.input.axis(Binding.move_y)) > 0
            :
                !Core.camera.position.within(unit.x, unit.y, 8) &&
                !unit.vel.isZero()
        }
        return !unit.vel.isZero();
    },

    movingAngle(unit){
        if(!module.exports.moving(unit)){
            return unit.rotation;
        } else {
            return unit.angleTo(unit.x + unit.vel.x, unit.y + unit.vel.y);
        }
    },

    willStuck(target, x, y){
        if(target.type.flying || target.elevation > 0.9) return false;
    
        const dst = Math.round(Mathf.dst(x, y, target.x, target.y) / 8);
        const angle = Angles.angle(target.x, target.y, x, y);
    
        for(let i = 0; i < dst; i++){
            Tmp.v1.trns(angle, i * 8).add(target.x, target.y);
    
            if(Vars.world.tileWorld(Tmp.v1.x, Tmp.v1.y).solid()) return true;
        }
    
        return false;
    }
}