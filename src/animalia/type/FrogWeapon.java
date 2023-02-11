package animalia.type;

import animalia.entities.units.FrogEntity;
import arc.graphics.g2d.Draw;
import arc.math.Angles;
import arc.math.Mathf;
import mindustry.entities.units.WeaponMount;
import mindustry.gen.Unit;
import mindustry.type.Weapon;

public class FrogWeapon extends Weapon {
    public FrogWeapon(String name){
        super(name);
    }

    @Override
    public void draw(Unit unit, WeaponMount mount){
        super.draw(unit, mount);

        float
        z = Draw.z(),
        e = 9 * ((FrogEntity) unit).slope(),
        rotation = unit.rotation - 90,
        realRecoil = Mathf.pow(mount.recoil, recoilPow) * recoil,
        weaponRotation  = rotation + (rotate ? mount.rotation : baseRotation),
        wx = unit.x + Angles.trnsx(rotation, x, y) + Angles.trnsx(weaponRotation, 0, -realRecoil),
        wy = unit.y + Angles.trnsy(rotation, x, y) + Angles.trnsy(weaponRotation, 0, -realRecoil);

        Draw.z(z + layerOffset);

        if(e > 0){
            Draw.rect(region, wx, wy, region.width * Draw.scl * Draw.xscl + e, region.height* Draw.scl * Draw.yscl + e, weaponRotation);
            Draw.rect(outlineRegion, wx, wy, region.width * Draw.scl * Draw.xscl + e, region.height* Draw.scl * Draw.yscl + e, weaponRotation);
        }
    }
}
