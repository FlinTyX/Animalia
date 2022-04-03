module.exports = function(object){
    return extend(BasicBulletType, Object.assign({
        speed: 1.16,
        damage: 5.4,
        lifetime: 60 * 5.5,
        collides: false,
        hittable: true,
        absorbable: true,
        pierce: true,
        homingRange: 70,

        despawnEffect: Fx.massiveExplosion,

        trailWidth: 2,
        trailLength: 5,
        trailColor: Pal.remove,

        width: 10,
        height: 10,

        continuousDamage(){
            return this.damage / 8 * 60;
        },
        init(b){
            if(!b) return;

            b.vel.set(this.speed * 10, this.speed * 10);
        },
        update(b){
            this.super$update(b);

            const target = Units.closestTarget(b.team, b.x, b.y, this.homingRange * 1.66, e => e.checkTarget(this.collidesAir, this.collidesGround) && !b.hasCollided(e.id), t => this.collidesGround && !b.hasCollided(t.id));
        
            if(target){
                if(b.timer.get(1, 5)){
                    target.damage(this.damage);
                }

                if(!b.within(target, target.hitSize * 2) && b.rotation() != b.angleTo(target)){
                    const v = Math.max(this.speed, target.hitSize / 4.66 * this.speed);

                    b.vel.set(v, v);
                    b.vel.setAngle(b.angleTo(target) + Mathf.randomSeed(b.id * b.fin(), -30, 30));
                }
            }
        },
        draw(b){
            this.drawTrail(b);

            Draw.color(this.trailColor);
            Fill.circle(b.x, b.y, this.width/4);
        }
    }, object));
}