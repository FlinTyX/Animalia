const FrogAI = require("types/ai/FrogAI"),
      {FrogSpawner} = require("units/ANIspawners"),
      {moving, movingAngle, willStuck} = require("libs/ANIfunctions"),
      {addStats, statValue, statValueBundle} = require("ui/ANIui"),
      {landSmoke, tongueAttack} = require("libs/ANIfx"),
      {AnimalType, AnimalEntity} = require("types/animals/AnimalType");

function FrogType(name, object){
    this.name = name;

    this.type = new AnimalType(this.name, Object.assign({
        flying: false,
        drawCell: false,
        drawBody: false,

        hitSize: 10,
        speed: 0.001999,
        rotateSpeed: 360,
        baseRotateSpeed: 360,
        canDrown: false,
        commandLimit: 0,
        itemCapacity: 0,

        mechFrontSway: 0,
        mechSideSway: 0,

        jumpTime: 30,
        jumpLen: 5.5,
        jumpChance: 0.01,
        swimLen: 3.5,
        swimSpeed: 0.88,

        usesTongue: true,
        maxTargetSize: 13,
        reloadTime: 160,

        spawnFloors: [
            Blocks.water.localizedName,
            Blocks.sandWater.localizedName,
        ],

        validateSpawn(tile){
            return !tile.solid() && !tile.floor().isLiquid
        },
        drawSoftShadow(unit, alpha){
            this.super$drawSoftShadow(unit, 1 - unit.fslope());
        },
        drawMech(){
            //no leg
        },
        load(){
            this.super$load();
            
            this.region = Core.atlas.find(this.name);
            this.jumpRegion = Core.atlas.find(this.name + "-jump");

            this.swimRegion = Core.atlas.find(this.name + "-swim");
            this.swimOutlineRegion = Core.atlas.find(this.name + "-swim-outline");

            this.outlineRegion = Core.atlas.find(this.name + "-outline");
            this.jumpOutlineRegion = Core.atlas.find(this.name + "-jump-outline");
        },
        reStats(){
            this.stats.remove(Stat.speed);

            let floors = "[]";

            this.spawnFloors.forEach(e => {
                if(e){
                    floors += e.toString() + (this.spawnFloors.indexOf(e) != this.spawnFloors.length - 1 ? ", " : "");
                }
            });

            addStats(this.stats, Stat.flying, true, [
                statValueBundle("stat.swim", "yes"),
                statValueBundle("stat.jump", "yes"),
                statValue("stat.spawns", floors),
                statValue("stat.jumpsize", "~" + ((this.jumpLen + 2) * 0.22).toString() + " " + Core.bundle.get("unit.blocks")),
                statValue("stat.swimsize", "~" + (1.5 * 1.5).toString() + " -> " + ((this.swimLen + 1.5) * 2).toString() + " " + Core.bundle.get("unit.blocks"))
            ]);
        },
        setStats(){
            this.super$setStats();
            this.reStats();
        },
        icons(){
            return [
                this.region,
                this.outlineRegion
            ]
        }
    }, object));

    this.type.constructor = () => new FrogEntity(this.type, {});

    this.type.defaultController = prov(() => !this.type.usesTongue ? new FrogAI() : new FrogAI({
        maxTargetSize: this.type.maxTargetSize,
        reload: this.type.reloadTime,

        get(){
            return Object.create(this);
        },
        updateUnit(){
            this.super$updateUnit();
            this.faceTarget();
        },
        updateTargeting(){
            if(this.invalid(this.target)){
                this.target = null;
                this.unit.isShooting = false;
            }

            if(this.checkTarget(this.target, this.unit.x, this.unit.y, this.unit.type.range)){
                const ret = this.retarget();

                if(ret){
                    this.target = this.findTarget(this.unit.x, this.unit.y, this.unit.type.range, this.unit.type.targetAir, this.unit.type.targetGround);
                    this.unit.isShooting = true;
                }
            } 

            if(this.target != null && this.shouldShoot() && this.unit.canShoot()){
                tongueAttack.at(this.unit.x, this.unit.y, 0, {unit: this.unit, target: this.target});
                this.unit.isShooting = false;
            }
        },
        shouldShoot(){
            return this.unit.isShooting && Math.abs(this.unit.rotation - this.unit.angleTo(this.target)) < 3.6;
        },
        retarget(){
            return this.unit.canShoot() && this.timer.get(this.timerTarget3, this.reload);
        },
        faceTarget(){
            if(this.target != null && this.unit.canShoot()){
                this.unit.rotation = Angles.moveToward(this.unit.rotation, this.unit.angleTo(this.target), Time.delta * 4);
            } else if(this.unit.moving()){
                this.unit.lookAt(this.unit.vel.angle());
            }
        },
        checkTarget(target, x, y, range){
            return !(target != null && target.within(x, y, range + target.hitSize/2));
        },
        findTarget(x, y, range, air, ground){
            let target = null;
    
            Units.nearby(x - range, y - range, range * 2, range * 2, e => {
                if(e.checkTarget(air, ground) && e.within(x, y, range + e.hitSize/2) && !willStuck(e, this.unit.x, this.unit.y)){
                    if(e.type != this.unit.type && e.hitSize < this.maxTargetSize) target = e;
                }
            });
    
            return target;
        },
        invalid(target){
            return !(target != null && target.isValid() && target.within(this.unit.x, this.unit.y, this.unit.type.range + target.hitSize/2));
        }
    }));

    FrogSpawner.push(this.type);

    return this.type;
}

function FrogEntity(frog, object){
    return new AnimalEntity(MechUnit, frog, Object.assign({
        interval: new Interval(2),
        jumping: false,
        swimming: false,
        time: 0,
        len: 0,

        drawOutlineRegion(unit, region, w, h){
            Draw.reset();

            this.type.applyColor(unit);
            this.type.applyOutlineColor(unit);

            Draw.rect(region, unit.x, unit.y, w, h, unit.rotation - 90);
            Draw.reset();
        },
        jump(rotCone){
            landSmoke.at(this.x, this.y);
            this.jumping = true;
            this.swimming = false;
            this.len = Math.random() * 2 + frog.jumpLen;
            this.time = 0;

            this.lookAtCorrect(rotCone);
        },
        land(){
            landSmoke.at(this.x, this.y);
            this.jumping = false;
            this.time = 0;
        },
        startSwim(){
            this.swimming = true;
            this.time = 0;
            this.len = 1.5 + (Math.random() * frog.swimLen) * 60;
        },
        endSwim(){
            this.swimming = false;
            this.time = 0;
        },
        fslope(){
            return this.swimming ? 0 : Math.abs((0.5 - Math.abs((this.time / frog.jumpTime) - 0.5)) * 2);
        },
        lookAtCorrect(rotCone){
            this.lookAt(
                this.controlled() ? movingAngle(this) : this.rotation + Mathf.range(rotCone)
            );

            this.baseRotation = this.rotation;

            return this.rotation;
        },
        controlled(){
            return this.controller instanceof LogicAI || this.controller instanceof Player;
        },
        onLiquid(){
            const f = this.floorOn();

            return f != null && !f.solid && f.isLiquid && !this.jumping;
        },
        floorSpeedMultiplier(){
            return this.floorOn().isDeep() ? 1 : 1.2;
        },
        canShoot(){
            return !moving(this) && !(this.swimming || this.jumping);
        },
        canJump(){
            return !this.jumping &&
                   ((!this.isShooting && frog.usesTongue) || !frog.usesTongue) &&
                   this.interval.get(0, frog.jumpTime * 1.3) && 
                   (Mathf.chanceDelta(frog.jumpChance) && !this.controlled() || moving(this) && this.controlled() && !this.jumping);
        },
        canSwim(){
            return !this.controlled() && !this.swimming;
        },
        update(){
            this.super$update();

            //swim shit
            if(this.onLiquid()){
                if(moving(this) && this.controlled() || this.swimming){
                    const fslope = this.controlled() ? 1 : Math.abs((0.5 - Math.abs((this.time / this.len) - 0.5)) * 2 * Time.delta),
                          len = frog.swimSpeed * this.floorSpeedMultiplier() * fslope;
                    
                    this.rotation = Angles.moveToward(this.rotation, (this.controlled() || this.len == 0) ? movingAngle(this) : !this.target ? Mathf.randomSeed(this.len, 360) : (this.angleTo(this.target.x, this.target.y) + 180), Time.delta * 3);

                    const x = Angles.trnsx(this.rotation, len),
                          y = Angles.trnsy(this.rotation, len);

                    this.move(x, y);
                }

                if(this.swimming){
                    this.time < this.len && !this.controlled() ? this.time += Time.delta : this.endSwim();
                }
                
                return;
            }

            if(this.controlled() && this.canJump()){
                this.jump(0);
            }

            if(this.jumping && !this.swimming){
                const len = (this.len / Vars.tilesize) * this.fslope();

                this.time < frog.jumpTime ? this.time += Time.delta : this.land();
                
                this.vel.trns(this.rotation, len);
            }
        },
        draw(){
            Draw.z(Layer.groundUnit);

            if(!this.jumping){
                if(!this.onLiquid()){
                    
                    this.drawOutlineRegion(this, frog.outlineRegion, frog.outlineRegion.width / 4, frog.outlineRegion.height / 4);
                    this.colorBegin();
                    Draw.rect(frog.region, this.x, this.y, this.rotation - 90);

                } else {

                    this.drawOutlineRegion(this, frog.swimOutlineRegion, frog.swimOutlineRegion.width / 4, frog.swimOutlineRegion.height / 4);
                    this.colorBegin();
                    Draw.rect(frog.swimRegion, this.x, this.y, this.rotation - 90);
                    
                }
            } else {
                const elevation = 4 * this.fslope();
                const w = frog.jumpRegion.width * Draw.scl * Draw.xscl + elevation;
                const h = frog.jumpRegion.height * Draw.scl * Draw.yscl + elevation;

                this.drawOutlineRegion(this, frog.jumpOutlineRegion, w, h);
                this.colorBegin();

                Draw.rect(
                    frog.jumpRegion,
                    this.x,
                    this.y,
                    w,
                    h,
                    this.rotation - 90
                ); 
            }
            
            this.colorEnd();

            this.super$draw();
        }
    }, object));
}

module.exports = {
    FrogType : FrogType,
    FrogEntity : FrogEntity
}