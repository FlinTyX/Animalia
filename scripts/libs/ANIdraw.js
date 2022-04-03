module.exports = {
    requestRegion(build, rotation, sized){
        Tmp.v1.trns(rotation - 90, (build.block.size / 2 * Vars.tilesize) + Vars.tilesize / 2 + (sized.fullIcon.width * Draw.scl * Draw.xscl / 2)).add(build);
        Draw.rect(sized.fullIcon, Tmp.v1.x, Tmp.v1.y);
    }
}