package animalia.type.unit;

import arc.Core;
import arc.graphics.g2d.TextureRegion;

// TODO
public class ToadType extends FrogType {
    public TextureRegion walkRegion;

    public ToadType(String name){
        super(name);
    }

    @Override
    public void load(){
        super.load();
        walkRegion = Core.atlas.find(name + "-walk");
    }
}
