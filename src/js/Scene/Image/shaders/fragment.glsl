varying vec2 vUv;

uniform sampler2D u_map;
uniform sampler2D u_brushMap;
uniform float u_time;
uniform float u_aspect;
uniform vec2 u_uvScale;
uniform vec2 u_mouse;
uniform float u_outlineProgress;
uniform float u_brushShowProgress;
uniform float u_showOriginalProgress;
uniform float u_outlineEdge;
uniform float u_sketchIntensity;
uniform float u_sketchNoiseScale;
uniform float u_sketchNoiseIntensity;
uniform float u_brushNoiseScale;
uniform float u_brushNoiseIntensity;
uniform float u_originalRadius;
uniform float u_hideProgress;

vec2 getAspectCoords(vec2 coords) {
  coords.x *= u_aspect;

  return coords;
}

float getGrey(vec3 color) {
  return (color.r + color.g + color.b) / 3.0;
}

float getOutline(vec3 color, float edge) {
  float grey = getGrey(color);
  float progress = u_outlineProgress * edge;

  return smoothstep(progress - 0.05, progress, grey);
}

vec3 getSketchColor(vec2 uv) {
  float noise = snoise(vec3(uv * u_sketchNoiseScale, 0.0)) * u_sketchNoiseIntensity;

  return texture2D(u_map, uv + noise).rgb;
}

vec4 getBrushColor(vec2 coords) {
  float noise = snoise(vec3(coords * u_brushNoiseScale, 0.0));
  vec2 brushCoords = vUv + noise * u_brushNoiseIntensity;
  
  vec4 color = texture2D(u_brushMap, brushCoords);

  return color;
}

float getOriginalColor() {
  vec2 point = getAspectCoords(vUv);
  vec2 mouse = getAspectCoords(vec2(u_mouse.x, 1.0 - u_mouse.y));
  float radius = u_showOriginalProgress * u_originalRadius;
  float radiusOreol = radius * 0.75;

  float circle = distance(point, mouse);
  circle = 1.0 - smoothstep(radius, radius + radiusOreol, circle);

  return circle;
}

void main() {
  vec2 uv = (vUv - 0.5) * u_uvScale + 0.5;

	vec4 mapColor = texture2D(u_map, uv);
  
  vec3 outlineColor = vec3(getOutline(mapColor.rgb, u_outlineEdge));
  vec3 sketchColor = vec3(getSketchColor(uv));
  vec4 brushColor = getBrushColor(uv);

  float originalColor = getOriginalColor();
  
  vec3 color = mix(outlineColor, sketchColor, brushColor.a * u_brushShowProgress * u_sketchIntensity);
  color = mix(color, mapColor.rgb, originalColor * brushColor.a);
  
  color = mix(color, vec3(1.0), u_hideProgress);

  gl_FragColor = vec4(color, 1.0);
}
