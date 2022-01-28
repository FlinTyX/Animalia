//dont use everywhere
function uc(n){
    return Vars.content.getByName(ContentType.unit, "animalia-" + n.toString());
}

function ic(n){
    return Vars.content.getByName(ContentType.item, "animalia-" + n.toString());
}

function register(unit){
    return EntityMapping.register(unit.name, unit.constructor);
}

function round(A, B){
    return Math.round(A * B) / B;
}

function around(tx, ty, range, bool){
    let arr = [];
    for(let x = -range; x < range * 2; x++){
        for(let y = -range; y < range * 2; y++){
            let t = Vars.world.tile(tx + x, ty + y);
            if(t != null && bool(t)) arr.push(t);
        }
    }
    return arr;
}

function moving(unit){
    if(unit.controller instanceof Player){
        return !Vars.mobile ?
            Math.abs(Core.input.axis(Binding.move_x)) > 0 || 
            Math.abs(Core.input.axis(Binding.move_y)) > 0
        :
            Core.camera.position.within(unit.x, unit.y, 8) &&
            round(unit.vel.x, 100) != 0 ||
            round(unit.vel.y, 100) != 0
    }
    return unit.vel.x != 0 || unit.vel.x != 0;
}

//kinda useless
function movingAngle(unit){
    if(!moving(unit)){
        return unit.rotation;
    } else {
        return Angles.angle(0, 0, unit.vel.x, unit.vel.y);
    }
}

module.exports = {
    uc : uc,
    ic : ic,
    register : register,
    round : round,
    around : around,
    moving : moving,
    movingAngle : movingAngle
}