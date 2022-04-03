const carbonizer = module.exports = extend(GenericCrafter, "carbonizer", {
    load(){
        this.super$load();
        this.heatRegion = Core.atlas.find(this.name + "-heat");
        this.bottomRegion = Core.atlas.find(this.name + "-bottom");
    },
    icons(){
        return [
            this.bottomRegion,
            this.region
        ]
    }
});

carbonizer.buildType = () => extend(GenericCrafter.GenericCrafterBuild, carbonizer, {
    draw(){
        const item = this.block.outputItems[0].item;

        Draw.rect(carbonizer.bottomRegion, this.x, this.y);
        
        if(this.items.has(Items.sporePod) || this.items.has(item)){
            Draw.alpha(this.consValid() ? this.progress * 1.3 : Mathf.num(!this.items.has(Items.sporePod)));
            Draw.rect(item.fullIcon, this.x, this.y, 6, 6);
        }

        if(this.items.has(Items.sporePod)){
            Draw.alpha(1 - this.progress * 1.3);
            Draw.rect(Items.sporePod.fullIcon, this.x, this.y, 6, 6);
        }

        Draw.blend(Blending.additive);
        Draw.color(Tmp.c1.set(Pal.meltdownHit).mul(1 + Mathf.absin(Time.time, 1, 0.1)));
        Draw.alpha(this.warmup * 0.65);

        Draw.rect(carbonizer.heatRegion, this.x, this.y);
        
        Draw.blend();
        Draw.reset();

        Draw.rect(carbonizer.region, this.x, this.y);
    }
});