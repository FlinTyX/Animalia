//FUCK YOU RHINO AAAAAAAAAAAA~

//dies
const BlockBuildBeamShader = new Shaders.BuildBeamShader();

//Draws Construct effect
const DrawConstruct = (func) => {
    return extend(DrawBlock, {
        load(block){
            this.top = Core.atlas.find(block.name + "-top");
        },
        icons(block){
            return this.top.found() ? [block.region, this.top] : [block.region];
        },
        draw(build){
            Draw.rect(build.block.region, build.x, build.y, build.block.rotate ? build.rotdeg() : 0);
            
            Draw.draw(Layer.blockOver, () => {
                Draw.reset();
                Drawf.construct(build, func(build), 0, build.progress, build.warmup, build.totalProgress);
            });

            Draw.z(Layer.blockOver + 0.1);
            Draw.rect(this.top, build.x, build.y);
        }
    });
}

//Draws a lot of shit
const DrawBuilding = (color, func) => {
    return extend(DrawBlock, {
        load(block){
            this.bottom = Core.atlas.find(block.name + "-bottom");
        },
        icons(block){
            return [
                this.bottom, block.region
            ]
        },
        draw(build){
            Draw.rect(this.bottom, build.x, build.y);

            if(build.warmup > 0.01){
                Draw.draw(Layer.block, () => {
                    Drawf.construct(build.x, build.y, !func ? build.block.outputItems[0].item.fullIcon : func(build), color, 0, build.progress, build.warmup, build.totalProgress);

                    Draw.color(color);
                    Draw.alpha(build.warmup);
                    Lines.lineAngleCenter(build.x + Mathf.sin(build.totalProgress, 20, Vars.tilesize / 2 * build.block.size - 2), build.y, 90, build.block.size * Vars.tilesize - 4);
                    Draw.reset();

                    Vars.renderer.effectBuffer.begin(Color.clear);
                    
                    Draw.color(color);
                    Draw.alpha(build.warmup * (0.85 + Mathf.sin(Time.time, 10, 0.08)));
                    Fill.square(build.x, build.y, build.block.size * Vars.tilesize/2);
                    
                    Vars.renderer.effectBuffer.end();
                    Vars.renderer.effectBuffer.blit(BlockBuildBeamShader);
                });
            }

            Draw.reset();
            Draw.rect(build.block.region, build.x, build.y, build.block.rotate ? build.rotdeg() : 0);
        }
    });
}

module.exports = {
    DrawConstruct : DrawConstruct,
    DrawBuilding : DrawBuilding
};