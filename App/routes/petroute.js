/** @format */

const express = require("express");
const router = express.Router();
const petController = require("../controllers/petcontroller");
const verifytoken = require("../middlewares/auth");

router.use(verifytoken);

router.post("/adopt", petController.adoptPet);
router.get("/sayhi", petController.getMyPet);
router.post("/speak", petController.talkToPet);
router.get("/sleep", petController.sleepPet);
router.post("/feed", petController.feedPet);
router.post("/play", petController.playWithPet);

module.exports = router;
