import { registerRoot } from "remotion";

import "@/lib/doehealth/doehealth-initiatives.css";
import "@/lib/doehealth/doehealth-landing.css";
import "@/lib/motion4/motion4-intro.css";
import "@/lib/motion3/motion3-remotion.css";
import "@/lib/motion-test/motion-test.css";
import "@/lib/product2/product2-agents.css";
import "@/lib/product2/product2-brown-mock.css";
import "@/lib/product2/product2-landing.css";

import { preloadShaderNoiseTexture } from "@/lib/doephone/shader-noise-texture";

import "./load-fonts";
import { RemotionRoot } from "./Root";

preloadShaderNoiseTexture();

registerRoot(RemotionRoot);
