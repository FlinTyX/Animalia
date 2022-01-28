const {ic} = require("libs/ANIfunctions");

const egg = extend(BulletType, {
    lifetime: 20.5,
    speed: 7.5,
    damage: 8.5,
    fragBullet: Bullets.fragGlassFrag,
    fragBullets: 4,
    ammoMultiplier: 3,
    splashDamageRadius: 20,
    splashDamage: 28.5,
    explodeRange: 17,
    hitEffect: Fx.flakExplosion,

    load(){
        this.region = Core.atlas.find("animalia-eggshell");
    },
    draw(b){
        Draw.z(Layer.bullet - 1);
        Draw.rect(this.region, b.x, b.y, b.rotation() + 360 * b.fin() * Mathf.signs[Math.floor(Mathf.randomSeed(b.id, 2))]);
    }
});

const thrower = extend(ItemTurret, "egg-thrower", {
    reloadTime: 10,
    range: 75 * 2,
    recoilAmount: 2,
    inaccuracy: 10,
    ammoUseEffect: Fx.casing2,
    shootSound: Sounds.shootBig,
    cooldown: 0.03,
    restitution: 0.035,

    unitSort: UnitSorts.weakest,

    init(){
        this.super$init();
        this.ammo(
            ic("eggshell"), egg
        );
    }
});

thrower.buildType = () => extend(ItemTurret.ItemTurretBuild, thrower, {});