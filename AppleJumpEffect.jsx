// ============================================================
// Apple UI Slide-In + Jump Effect — After Effects Script
// ============================================================
// Slides a layer in from a chosen direction with an Apple-style
// spring overshoot and jump settle.
//
// HOW TO USE:
//   1. Position layers at their FINAL resting place in the comp.
//   2. Select one or more layers.
//   3. Move playhead to where the animation should START.
//   4. File > Scripts > Run Script File… → choose this file.
// ============================================================

(function appleSlideJump() {

    // ── UI ───────────────────────────────────────────────────
    var win = new Window("dialog", "Apple Slide + Jump", undefined, { resizeable: false });
    win.orientation  = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 10;
    win.margins = 18;

    var title = win.add("statictext", undefined, "Apple UI  ·  Slide In + Jump");
    title.graphics.font = ScriptUI.newFont("dialog", "BOLD", 13);

    win.add("panel");

    // ── Direction ────────────────────────────────────────────
    var dirPanel = win.add("panel", undefined, "Slide Direction");
    dirPanel.orientation  = "row";
    dirPanel.alignChildren = "left";
    dirPanel.margins = 10;
    dirPanel.spacing = 8;

    var dirButtons = {
        bottom : dirPanel.add("radiobutton", undefined, "Bottom"),
        top    : dirPanel.add("radiobutton", undefined, "Top"),
        left   : dirPanel.add("radiobutton", undefined, "Left"),
        right  : dirPanel.add("radiobutton", undefined, "Right")
    };
    dirButtons.bottom.value = true; // default

    // ── Timing ───────────────────────────────────────────────
    var timingPanel = win.add("panel", undefined, "Timing");
    timingPanel.orientation  = "column";
    timingPanel.alignChildren = ["fill", "top"];
    timingPanel.margins = 10;
    timingPanel.spacing = 6;

    function row(parent, label, val, w) {
        var g = parent.add("group");
        g.add("statictext", undefined, label).preferredSize.width = 160;
        var f = g.add("edittext", undefined, String(val));
        f.preferredSize.width = w || 52;
        return f;
    }

    var durInput      = row(timingPanel, "Duration  (frames):",     22);
    var slideInput    = row(timingPanel, "Slide Distance  (px):",  120);
    var overshootInput= row(timingPanel, "Overshoot  (px):",        18);
    var jumpInput     = row(timingPanel, "Jump Height  (px):",      22);
    var scaleInput    = row(timingPanel, "Scale Punch  (%):",      108);
    var squashInput   = row(timingPanel, "Squash on Land  (%):",    93);
    var staggerInput  = row(timingPanel, "Stagger  (frames):",       4);

    win.add("panel");

    var btnRow = win.add("group");
    btnRow.alignment = "center";
    var applyBtn  = btnRow.add("button", undefined, "Apply");
    var cancelBtn = btnRow.add("button", undefined, "Cancel");

    cancelBtn.onClick = function () { win.close(); };

    applyBtn.onClick = function () {
        var dir       = dirButtons.bottom.value ? "bottom"
                      : dirButtons.top.value    ? "top"
                      : dirButtons.left.value   ? "left"
                      : "right";

        var params = {
            dur        : Math.max(6,  parseInt(durInput.text)       || 22),
            slide      : Math.max(0,  parseFloat(slideInput.text)   || 120),
            overshoot  : Math.max(0,  parseFloat(overshootInput.text)|| 18),
            jump       : Math.max(0,  parseFloat(jumpInput.text)    || 22),
            scale      : Math.max(50, parseFloat(scaleInput.text)   || 108),
            squash     : Math.max(50, parseFloat(squashInput.text)  || 93),
            stagger    : Math.max(0,  parseInt(staggerInput.text)   || 4),
            dir        : dir
        };

        var n = run(params);
        win.close();
        if (n > 0) alert("Applied to " + n + " layer(s).");
        else       alert("Select at least one layer first.");
    };

    win.show();

    // ── Main runner ──────────────────────────────────────────
    function run(p) {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) { alert("Open a composition first."); return 0; }
        var layers = comp.selectedLayers;
        if (!layers.length) return 0;

        var fps = comp.frameRate;
        var ft  = 1 / fps;

        app.beginUndoGroup("Apple Slide + Jump");
        for (var i = 0; i < layers.length; i++) {
            animateLayer(layers[i], comp, ft, p, i);
        }
        app.endUndoGroup();
        return layers.length;
    }

    // ── Per-layer animation ──────────────────────────────────
    function animateLayer(layer, comp, ft, p, idx) {
        var posProp   = layer.property("ADBE Transform Group").property("ADBE Position");
        var scaleProp = layer.property("ADBE Transform Group").property("ADBE Scale");
        var is3D      = layer.threeDLayer;

        var finalPos   = posProp.value;
        var finalScale = scaleProp.value;

        // Stagger offset per layer
        var t0 = comp.time + idx * p.stagger * ft;

        // ── Timing ──────────────────────────────────────────
        // The animation has 4 phases:
        //
        //  [slide in fast]──▶[overshoot]──▶[pull back + jump]──▶[settle]
        //
        //   t0        tArrive   tOver      tJumpPeak   tLand      tEnd
        //   |─── 40% ───|── 15%──|──── 20% ───|── 15% ──|── 10% ──|

        var totalF    = p.dur;
        var tArrive   = t0   + Math.round(totalF * 0.40) * ft;
        var tOver     = tArrive + Math.round(totalF * 0.15) * ft;
        var tJumpPeak = tOver   + Math.round(totalF * 0.20) * ft;
        var tLand     = tJumpPeak + Math.round(totalF * 0.15) * ft;
        var tEnd      = t0   + totalF * ft;

        // ── Compute slide offsets ────────────────────────────
        // "start" is the off-screen position before the slide begins.
        var slideOffX = 0, slideOffY = 0;
        if      (p.dir === "bottom") slideOffY =  p.slide;
        else if (p.dir === "top")    slideOffY = -p.slide;
        else if (p.dir === "left")   slideOffX = -p.slide;
        else                          slideOffX =  p.slide;

        // For the overshoot we go *slightly past* final in the slide direction
        var overX = (p.dir === "left")  ? -p.overshoot
                  : (p.dir === "right") ?  p.overshoot : 0;
        var overY = (p.dir === "top")   ? -p.overshoot
                  : (p.dir === "bottom")?  p.overshoot : 0;

        // Jump goes opposite to slide direction for the "kick"
        // e.g. slides up from bottom → jump also goes slightly up
        var jumpY = (p.dir === "bottom" || p.dir === "top") ? -p.jump : -p.jump * 0.5;
        var jumpX = (p.dir === "left"  || p.dir === "right") ? 0 : 0;

        // ── Position keyframes ───────────────────────────────
        function posAt(time, dx, dy) {
            var v = is3D
                ? [finalPos[0] + dx, finalPos[1] + dy, finalPos[2]]
                : [finalPos[0] + dx, finalPos[1] + dy];
            posProp.setValueAtTime(time, v);
        }

        // t0       — starts off-screen (slide start)
        posAt(t0,       slideOffX,       slideOffY);
        // tArrive  — reaches final position (fast slide done)
        posAt(tArrive,  0,               0);
        // tOver    — overshoots slightly in slide direction
        posAt(tOver,    overX,           overY);
        // tJumpPeak — pull back and jump up
        posAt(tJumpPeak, jumpX,          jumpY);
        // tLand    — lands back, tiny overshoot downward
        posAt(tLand,    0,               p.jump * 0.08);
        // tEnd     — final rest
        posAt(tEnd,     0,               0);

        // ── Scale keyframes ──────────────────────────────────
        function scaleAt(time, sx, sy) {
            var v = is3D ? [sx, sy, 100] : [sx, sy];
            scaleProp.setValueAtTime(time, v);
        }

        // t0        — slightly compressed in travel direction (travel squash)
        var travelSX = (p.dir === "left" || p.dir === "right") ? 93 : 100;
        var travelSY = (p.dir === "top"  || p.dir === "bottom") ? 93 : 100;
        scaleAt(t0,       travelSX,     travelSY);

        // tArrive   — impact squash (squish on landing)
        var impactSX = (p.dir === "left" || p.dir === "right") ? p.squash : 105;
        var impactSY = (p.dir === "top"  || p.dir === "bottom") ? p.squash : 105;
        scaleAt(tArrive,  impactSX,     impactSY);

        // tOver     — stretch into overshoot
        scaleAt(tOver,    101,  101);

        // tJumpPeak — punchy scale at jump peak
        scaleAt(tJumpPeak, p.scale, p.scale);

        // tLand     — squash on land
        scaleAt(tLand,    105,     p.squash - 2);

        // tEnd      — settle to 100
        scaleAt(tEnd,     100,     100);

        // ── Easing ───────────────────────────────────────────
        applyEasing(posProp,   is3D);
        applyEasing(scaleProp, is3D);
    }

    // ── Easing helper ────────────────────────────────────────
    // Applies custom temporal easing to simulate Apple spring physics:
    //   Key 1 (off-screen start) : explosive fast exit
    //   Key 2 (arrive)           : fast in, snappy
    //   Key 3 (overshoot)        : quick through
    //   Key 4 (jump peak)        : fast in / fast out
    //   Key 5 (land squash)      : fast in, slow out
    //   Key 6 (final rest)       : gentle ease in
    function applyEasing(prop, is3D) {
        var n = prop.numKeys;
        if (n < 2) return;

        // Presets  [speed, influence]
        var SNAP_OUT  = new KeyframeEase(0,   90);  // explosive start
        var FAST_IN   = new KeyframeEase(0,   85);  // arrives fast
        var FAST_OUT  = new KeyframeEase(0,   80);  // leaves fast
        var SPRING_IN = new KeyframeEase(0,   75);  // spring arrives
        var SOFT_IN   = new KeyframeEase(0,   65);  // gentle settle
        var SOFT_OUT  = new KeyframeEase(0,   40);  // gentle exit
        var MED       = new KeyframeEase(0.5, 50);

        var presets = [
            // [ easeIn,    easeOut  ]
            [MED,       SNAP_OUT ],   // key 1: off-screen start
            [FAST_IN,   FAST_OUT ],   // key 2: arrive at final pos
            [FAST_IN,   FAST_OUT ],   // key 3: overshoot
            [SPRING_IN, FAST_OUT ],   // key 4: jump peak
            [FAST_IN,   SOFT_OUT ],   // key 5: land squash
            [SOFT_IN,   MED      ]    // key 6: final rest
        ];

        for (var k = 1; k <= n; k++) {
            var pi  = Math.min(k - 1, presets.length - 1);
            var eIn  = presets[pi][0];
            var eOut = presets[pi][1];
            try {
                prop.setTemporalEaseAtKey(k, [eIn],             [eOut]);
            } catch (e) {
                // 3D multi-dimensional property needs 3-element arrays
                try {
                    prop.setTemporalEaseAtKey(k, [eIn,eIn,eIn], [eOut,eOut,eOut]);
                } catch (e2) {}
            }
        }
    }

})();
