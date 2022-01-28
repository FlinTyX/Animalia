const smoke = new Effect(20, e => {
    Draw.color(e.color, Pal.lightishGray, e.fin());
    Draw.z(Layer.block + 0.001);

    Angles.randLenVectors(e.id, 8, 6 * e.finpow(), (x, y) => {
        Fill.circle(e.x + x, e.y + y, 1.15 * e.fslope());
    });
});

const incubator = extend(PayloadBlock, "incubator", {
    eggTypes: [],

    load(){
        this.super$load();
        this.heatRegion = Core.atlas.find(this.name + "-heat");
        this.glassHeatRegion = Core.atlas.find(this.name + "-glassHeat");
        this.softShadowRegion = Core.atlas.find("circle-shadow");
    },
    init(){
        this.super$init();
        Vars.content.items().each(i => {
            if(i.name.startsWith("animalia") && i.name.endsWith("-egg")){
                this.eggTypes.push(i);
            }
        });
    },
    icons(){
        return [
            this.region,
            this.topRegion 
        ];
    },
    setStats(){
        this.super$setStats();

        const types = this.eggTypes;
        const interval = new Interval();

        //input & output
        this.stats.add(Stat.input, extend(StatValue, {
            display(table){
                table.clear();
                table.row();
                table.center().bottom()

                table.table(null, t => {
                    t.row();

                    types.forEach(i => {
                        t.row();

                        t.table(null, a => {
                            a.row();
                            a.add(i.unit().localizedName);
                            a.row();
                            a.image().width(400).color(Pal.power).pad(5);
                            a.row();

                            a.table(null, e => {
                                //input
                                e.add(Core.bundle.get("stat.input") + ":");
                                e.add(new ItemImage(i.upRegion(), 1)).pad(5);
                                e.add("[lightgray]" + i.localizedName);
                                e.row();

                                //output
                                e.add(Core.bundle.get("stat.output") + ":");
                                e.add(new ItemImage(i.unit().shadowRegion, 1)).padLeft(5);
                                e.add("[lightgray]" + i.unit().localizedName);
                            });
                        }).width(400).padLeft(-10).padTop(10);
                    });
                });
            }
        }));
    },
    setBars(){
        this.super$setBars();
        this.bars.add("progress", e => new Bar(
                "bar.hatch",
                Pal.accent, 
                () => e.fraction()
            )
        );
    },
    drawRequestRegion(req, list){
        Draw.rect(this.region, req.drawx(), req.drawy());
        Draw.rect(this.outRegion, req.drawx(), req.drawy(), req.rotation * 90);
        Draw.rect(this.topRegion, req.drawx(), req.drawy());
    }
});

incubator.buildType = () => extend(PayloadBlock.PayloadBlockBuild, incubator, {
    egg: null,
    warmup: 0,
    progress: 0,

    valid(){
        return this.egg != null && this.enabled;
    },
    hatch(){
        this.payload = new UnitPayload(this.egg.unit().create(this.team));
        
        smoke.at(this.x, this.y, Pal.meltdownHit);

        this.items.remove(this.egg, 1);
        this.progress = 0;
    },
    shouldOutputPayload(){
        const front = this.front();
        return this.payload != null && front != null && (front.block.outputsPayload || front.block.acceptsPayload);
    },
    moveOutPayload(){
        if(!this.payload) return;

        this.updatePayload();

        const size = this.block.size, tilesize = Vars.tilesize;
        const dest = Tmp.v1.trns(this.rotdeg(), size * tilesize/2);

        this.payRotation = Angles.moveToward(this.payRotation, this.rotdeg(), this.block.payloadRotateSpeed * this.edelta());
        this.payVector.approach(dest, this.block.payloadSpeed * this.delta());

        const front = this.front();
        const canMove = front != null && (front.block.outputsPayload || front.block.acceptsPayload);

        if(this.payVector.within(dest, 0.001)){
            this.payVector.clamp(-size * tilesize / 2, -size * tilesize / 2, size * tilesize / 2, size * tilesize / 2);

            if(canMove){
                if(this.movePayload(this.payload)){
                    smoke.at(this.x, this.y, Color.gray);
                    this.payload = null;
                }
            }
        }
    },
    drawSoftShadow(){
        Draw.color(0, 0, 0, 0.3);
        const rad = 1.6;
        const size = 30 * Draw.scl;
        Draw.rect(incubator.softShadowRegion, this, size * rad * Draw.xscl, size * rad * Draw.yscl, this.rotdeg());
        Draw.color();
    },
    fraction(){
        return this.progress;
    },
    updateTile(){
        this.super$updateTile();

        this.egg = this.items.first();

        if(this.shouldOutputPayload()){
            this.moveOutPayload();
        }

        this.warmup = Mathf.approachDelta(this.warmup, Mathf.num(this.valid() && this.power.status > 0.95), 0.006);

        if(this.valid() && this.power.status > 0.9){
            this.progress += this.getProgressIncrease(this.egg.hatchTime());

            if(this.progress >= 1){
                this.hatch();
            }

        } else this.progress = this.progress * this.warmup;
    },
    draw(){
        Draw.rect(incubator.region, this.x, this.y);
        Draw.rect(incubator.outRegion, this.x, this.y, this.rotdeg());

        Draw.color(Color.orange, Color.yellow, Pal.accent, Mathf.absin(Time.time, 8, 1));
        Draw.alpha(this.warmup * (0.55 + Mathf.absin(Time.time, 10, 0.2)));
        Draw.blend(Blending.additive);
        Draw.rect(incubator.heatRegion, this.x, this.y);

        Draw.blend();
        Draw.color();
        Draw.reset();

        if(this.valid()){

            Draw.rect(this.egg.upRegion(), this.x, this.y);

        } else if(this.payload != null){

            const region = this.payload.unit.type.shadowRegion; //full sprite

            const m = 1 + Mathf.sin(Time.time, 25, 0.1);
            const width = region.width * Draw.scl * m;
            const height = region.height * Draw.scl * m;

            const sw = width / 28;
            const sh = height / 28;
    
            Draw.rect(region, this.x, this.y, sw * 16, sh * 16, this.rotdeg() - 90);
    
        }

        this.drawSoftShadow();

        Draw.z(Layer.block + 0.002);
        Draw.rect(incubator.topRegion, this.x, this.y);
    },
    display(table){
        this.super$display(table);
        table.table(null, t => {
            table.row();
            t.add(new Image()).size(32).pad(5).update(i => i.setDrawable(
                this.valid() ? 
                    this.egg.upRegion() :
                    this.payload != null ?
                        this.payload.unit.type.shadowRegion
                        :
                        Icon.warning
                )
            );

            t.add(new Label("")).update(l => l.setText(
                this.valid() ?
                    this.egg.localizedName :
                    this.payload != null ?
                        this.payload.unit.type.localizedName
                        :
                        "[gray]" + Core.bundle.get("empty")
                )
            );
        }).left().pad(5);
    },
    acceptItem(source, item){
        return (
            incubator.eggTypes.indexOf(item) != -1 && 
            this.items.get(item) < this.block.itemCapacity &&
            source.team == this.team && 
            !this.payload
        );
    },
    acceptPayload(source, payload){
        return false;
    },
    write(write){
        this.super$write(write);
        write.f(this.progress);
    },
    read(read, revision){
        this.super$read(read, revision);
        this.progress = read.f();
    }
});