const {register, around, moving, movingAngle} = require("libs/ANIfunctions");
const {addStats, statValue} = require("libs/ANIui");

const waters = [
    Blocks.water.name,
    Blocks.taintedWater.name,
    Blocks.sandWater.name,
    Blocks.darksandWater.name
];

function rand(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}

function get(){
    let tile = [];

    Vars.world.tiles.eachTile(t => {
        if(!t.solid() && waters.indexOf(t.floor().name) != -1){
            let a = around(t.x, t.y, 1, e => !e.solid() && !e.floor().isLiquid);

            if(a.length > 0){
                tile.push({
                    tile: t,
                    floors: a      
                });
            }
        }
    });

    return tile;
}

function spawn(team, object){
    const {x, y} = object.tile;
    const floor = rand(object.floors);
    const angle = Angles.angle(x * 8, y * 8, floor.x * 8, floor.y * 8);

    const unit = frog.spawn(team, x * 8, y * 8);
    unit.lookAt(angle);
    unit.jump(2, 0);
}

const smoke = new Effect(25, e => {
    Draw.color(Pal.gray, Pal.lightishGray, e.finpow());
    Draw.z(Layer.groundUnit - 1);

    Angles.randLenVectors(e.id, 4, 10 * e.fin(), (x, y) => {
        Fill.circle(e.x + x, e.y + y, 1.2 * e.fslope());
    });
});

const frog = extend(UnitType, "frog", {  
    jumpTime: 30,
    swimSpeed: 0.88,
    registeredId: -1,

    init(){
        this.super$init();
        this.registeredId = register(this);
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
    setStats(){
        this.super$setStats();
        this.stats.remove(Stat.speed);

        addStats(this.stats, Stat.flying, true, [
            statValue("stat.swim", "yes"),
            statValue("stat.jump", "yes")
        ]);
    },
    icons(){
        return [
            this.region,
            this.outlineRegion
        ]
    }
});

//this will be probably an AIController later, don't worry for now...
frog.constructor = () => extend(MechUnit, {
    classId: () => frog.registeredId,

    interval: new Interval(2),
    target: null,
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
    jump(len, rotCone){
        smoke.at(this.x, this.y);
        this.jumping = true;
        this.swimming = false;
        this.len = Math.random() * 2 + len;
        this.time = 0;

        this.lookAtCorrect(rotCone);
    },
    land(){
        smoke.at(this.x, this.y);
        this.time = 0;
        this.jumping = false;
    },
    startSwim(len){
        this.time = 0;
        this.swimming = true;
        this.len = len * 60;
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
            this.controlled() ?
            movingAngle(this) + (this.controller instanceof LogicAI ? 0 : (this.onLiquid() && this.controller instanceof Player ? 0 : 180))
        :
            !this.target ?
            this.rotation + Mathf.range(rotCone) : 
            this.angleTo(this.target.x, this.target.y) + 180
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
        return this.floorOn().isDeep() ? 1 : 1.1;
    },
    update(){
        this.super$update();

        if(this.interval.get(1, 60)){
            this.target = Units.closestEnemy(this.team, this.x, this.y, this.type.range, e => (e.team != this.team && (e.controller instanceof Player) && e.type.name != this.type.name));
        }

        //swim shit
        if(this.onLiquid()){
            if(moving(this) || this.swimming){
                const fslope = this.controlled() ? 1 : Math.abs((0.5 - Math.abs((this.time / this.len) - 0.5)) * 2);
                const len = frog.swimSpeed * this.floorSpeedMultiplier() * fslope;
                
                this.rotation = Angles.moveToward(this.rotation, (this.controlled() || this.len == 0) ? movingAngle(this) : !this.target ? Mathf.randomSeed(this.len, 360) : (this.angleTo(this.target.x, this.target.y) + 180), Time.delta * 3);

                const x = Angles.trnsx(this.rotation, len);
                const y = Angles.trnsy(this.rotation, len);

                this.move(x, y);
            }
            
            if(!this.controlled()){
                if(!this.swimming && (Mathf.chanceDelta(0.01) || this.target != null)){
                    this.startSwim(3 + (Math.random() * 2.5));
                }

                if(this.swimming){
                    this.time < this.len ? this.time += Time.delta : this.endSwim();
                }
            } else if(this.swimming) this.endSwim(); //sucks
            
            return;
        }

        //jump shit
        if(
            !this.jumping && 
            this.interval.get(0, frog.jumpTime * 1.3) && 
            (((Mathf.chanceDelta(0.01) || this.target != null) && !this.controlled()) || moving(this) && this.controlled())
        ){  
            this.jump(6.5, !this.target || !this.controlled() ? 70 : 0);
        }

        if(this.jumping && !this.swimming){
            const len = (this.len / frog.jumpTime * 0.6) * 1 - this.fslope();

            this.vel.trns(this.rotation + 180, len);
            this.time < frog.jumpTime ? this.time += Time.delta : this.land();
        }
    },
    draw(){
        Draw.z(Layer.groundUnit);

        this.type.drawSoftShadow(this, 1 - this.fslope());

        if(!this.jumping){
            if(!this.onLiquid()){
                
                this.drawOutlineRegion(this, frog.outlineRegion, frog.outlineRegion.width / 4, frog.outlineRegion.height / 4);
                Draw.rect(frog.region, this.x, this.y, this.rotation - 90);

            } else {

                this.drawOutlineRegion(this, frog.swimOutlineRegion, frog.swimOutlineRegion.width / 4, frog.swimOutlineRegion.height / 4);
                Draw.rect(frog.swimRegion, this.x, this.y, this.rotation - 90);
                
            }
        } else {
            const elevation = 4 * this.fslope();
            const w = frog.jumpRegion.width/4 + elevation;
            const h = frog.jumpRegion.height/4 + elevation;

            this.drawOutlineRegion(this, frog.jumpOutlineRegion, w, h);

            Draw.rect(
                frog.jumpRegion,
                this.x,
                this.y,
                w,
                h,
                this.rotation - 90
            ); 
        }
        Draw.reset();
    }
});

frog.defaultController = prov(() => extend(AIController, {}));

var map_valids = [];
var map_valids_usable = false:
var frog_thread = Threads.daemon(() => {
    while(true){
        while(Vars.state.menu || Vars.net.server() || map_valids_usable);
        map_valids = get();
        map_valids_usable = true;
    }
});

Events.on(EventType.WorldLoadEvent, () => {
    map_valids_usable = false;
});

Events.on(Trigger.update.getClass(), () => {
    if(Vars.state.menu || Vars.net.server() || !map_valids_usable || !Mathf.chanceDelta(0.0001) || !Vars.state.isPlaying()) return;

    if(map_valids.length > 0){
        //this can only spawn default teams frogs when there aren't any other teams in the current map
        for(let i = 0; i < Team.baseTeams.length; i++){
            let team = rand(Team.baseTeams);

            if(team != Team.derelict && Units.canCreate(team, frog)){
                spawn(team, rand(map_valids));

                if(!frog.unlocked && Vars.state.isCampaign()){
                    frog.unlock();
                }
                
                return;
            }
        }
    }
});
