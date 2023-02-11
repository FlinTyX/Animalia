package animalia.content;

import static mindustry.graphics.Shaders.*;

public class AniShaders {
    public static BuildBeamShader blockBuild;

    public static void load(){
        blockBuild = new BuildBeamShader();
    }
}
