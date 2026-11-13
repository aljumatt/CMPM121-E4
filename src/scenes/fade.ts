import Phaser from "phaser";

export function fadeOutAndSwitch(
  scene: Phaser.Scene,
  targetScene: string,
  data?: object,
): void {
  scene.cameras.main.fadeOut(450, 4, 2, 12);
  scene.cameras.main.once("camerafadeoutcomplete", () => {
    scene.scene.start(targetScene, data);
  });
}
