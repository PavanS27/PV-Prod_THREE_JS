(function () {
  // Set our main variables
  let scene,
    renderer,
    camera,
    controls,
    model, // Our character
    mixer, // THREE.js animations mixer
    clock = new THREE.Clock(), // Used for anims, which run to a clock instead of frame rate
    loaderAnim = document.getElementById("js-loader");

  init();

  function init() {
    const MODEL_PATH = document.getElementById("model").src;

    const canvas = document.querySelector("#c");
    const backgroundColor = 0xfff000;

    // Init the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    scene.fog = new THREE.Fog(backgroundColor, 60, 100);

    // Init the renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // Add a camera
    camera = new THREE.PerspectiveCamera(
      20,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    camera.position.z = 10;
    camera.position.x = 10;
    camera.position.y = 0;

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.enablePan = false;
    controls.dampingFactor = 1.5;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.5;

    let stacy_txt = new THREE.TextureLoader().load(
      "js/TexturesCom_Plastic0027_1_seamless_S.jpg"
    );
    stacy_txt.flipY = false;

    const stacy_mtl = new THREE.MeshPhongMaterial({
      map: stacy_txt,
      color: 0xffffff,
      skinning: true,
    });

    var loader = new THREE.GLTFLoader();

    loader.load(
      MODEL_PATH,

      function (gltf) {
        model = gltf.scene;

        model.traverse((o) => {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
            o.material = stacy_mtl;
          }
          // Reference the neck and waist bones
        });

        model.scale.set(7, 7, 7);
        model.position.x = 2.3;
        model.position.y = -0.1;
        model.position.z = 0;
        model.rotation.y = -1;
        model.rotation.z = 0;
        // setTimeout(function () {
        //   camera.position.x = -2;
        // }, 1500);

        scene.add(model);

        loaderAnim.remove();
      },
      undefined, // We don't need this function
      function (error) {
        console.error(error);
      }
    );

    let hemiLight = new THREE.HemisphereLight(0xfff000, 0xffffff, 0.91);
    hemiLight.position.set(0, 100, 0);
    // Add hemisphere light to scene
    scene.add(hemiLight);

    let d = 18.25;
    let dirLight = new THREE.DirectionalLight(0xfff000, 0.74);
    dirLight.position.set(-8, 0, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    dirLight.shadow.camera.left = d * -1;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = d * -1;
    // Add directional Light to scene
    scene.add(dirLight);

    // Floor
    let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    let floorMaterial = new THREE.MeshPhongMaterial({
      color: 0xfff000,
      shininess: 0.5,
    });

    let floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI;
    floor.receiveShadow = true;
    floor.position.y = -11;
    scene.add(floor);
  }

  function update() {
    controls.update();
    function updateCam(e) {
      camera.position.z = 10 + window.scrollY / 3;
    }
    window.addEventListener("scroll", updateCam);
    if (mixer) {
      mixer.update(clock.getDelta());
    }

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(update);
  }

  update();

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvasPixelWidth = canvas.width / window.devicePixelRatio;
    let canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize =
      canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  // Get a random animation, and play it
})();
