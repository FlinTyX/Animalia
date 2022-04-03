const panel = module.exports = extend(Block, "chlorophyll-panel", {
    outputsChemicalEnergy(){},
    energyOutput: 192,

    lightGreen: Color.valueOf("92dd7eff"),
    bloomColor: Color.valueOf("84f491ff"),

    load(){
        this.super$load();

        this.bloomRegion = Core.atlas.find(this.name + "-bloom");
    },
    setBars(){
        this.super$setBars();
        this.bars.add("progress", e => new Bar(
                "bar.chemicalEnergy",
                this.lightGreen, 
                () => e.output() / this.energyOutput
            )
        );
    },
    drawPlace(x, y, rotation, valid){
        this.super$drawPlace(x, y, rotation, valid);

        if(Vars.mobile) return;
        drawPossibleConnections(x, y, this, b =>
            b.block.usesChemicalEnergy == undefined ||
            b.connections != undefined && b.connections == 4
        );
    }
});

//WARNING: I SHOULD HAVE USED PROXIMITY OVERRIDING BUT THIS ALSO WORKS
function refreshNearby(build, arr, runnable){
    const trns = build.block.size/2 + 1;
    arr.splice(0, arr.length);

    for(let i = 0; i < 4; i++){
        let b = build.nearby(
            Geometry.d4[Mathf.mod(build.rotation + i, 4)].x * trns, 
            Geometry.d4[Mathf.mod(build.rotation + i, 4)].y * trns
        );

        if(
            b != null && 
            b.team == build.team &&
            runnable(b) &&
            (b.x == build.x || b.y == build.y)
        ) arr.push(b);
    }
}

function drawPossibleConnections(vx, vy, block, boolReturn){
    const width = Core.camera.width + 8;
    const height = Core.camera.height + 8;
    const r = block.size * Vars.tilesize/2;
    
    Vars.state.teams.getActive().forEach(t => {
        if(t.buildings == null) return;
        
        t.buildings.intersect(vx * 8 - width, vy * 8 - height, width * 2, height * 2, b => {
            if(boolReturn(b)) return;

            for(let i = 0; i < 4; i++){
                Tmp.v1.trns(90 * i, (block.size + b.block.size) * Vars.tilesize/2).add(b.x, b.y);
                let {x, y} = Tmp.v1; //readable

                if(Build.validPlace(block, b.team, x/8, y/8, 90 * i)){
                    Draw.color(Pal.placing);
                    Draw.alpha(Mathf.absin(15, 0.5));
                    Lines.quad(x - r, y - r, x + r, y - r, x + r, y + r, x - r, y + r);
                    Draw.reset();
                }
            }
        });
    });
}

panel.buildType = () => extend(Building, {
    productionEfficiency: 0,
    outputs: [],

    connections(){
        return Math.max(1, Math.min(this.outputs.length, 4));
    },
    output(){
        return panel.energyOutput * this.productionEfficiency;
    },
    updateProximity(){
        //does this fuck anything?
    },
    updateTile(){
        this.super$updateTile();

        //fps dies
        refreshNearby(this, this.outputs, b => 
            b.block.size > 2 &&
            b.block.usesChemicalEnergy != undefined
        );
        
        this.productionEfficiency = (this.enabled ?
            Mathf.maxZero(Attribute.light.env() + 
                (Vars.state.rules.lighting ?
                    1 - Vars.state.rules.ambientLight.a :
                    1
                )
            ) : 0) / this.connections();
    },
    draw(){
        this.super$draw();

        if(this.outputs.length > 0){
            Draw.z(Layer.blockOver);
            Draw.blend(Blending.additive);
            Draw.color(panel.bloomColor);
            Draw.alpha(0.8 + Mathf.absin(20, 0.2));

            this.outputs.forEach(build => {
                const angle = this.angleTo(build.x, build.y);
                const len = this.block.size * Vars.tilesize/2;

                Tmp.v1.trns(angle, len).add(this.x, this.y);

                Draw.rect(panel.bloomRegion, Tmp.v1.x, Tmp.v1.y, angle);
            });

            Draw.blend();
            Draw.reset();
        }
    },
    write(write){
        this.super$write(write);
        write.f(this.productionEfficiency);
    },
    read(read, revision){
        this.super$read(read, revision);
        this.productionEfficiency = read.f();
    }
});

module.exports = {
    refreshNearby : refreshNearby,
    drawPossibleConnections : drawPossibleConnections
}