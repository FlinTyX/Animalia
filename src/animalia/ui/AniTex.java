package animalia.ui;

import arc.scene.style.Drawable;
import static arc.Core.*;

public class AniTex {
    public static Drawable frog;

    public static void load(){
        app.post(() -> {
            frog = atlas.drawable("animalia-icon-frog");
        });
    }
}
