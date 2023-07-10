const express = require('express');
const router = express.Router();
const catModel = require("../models/cat_M");

router.get('/Add',(req, res) => {

  res.render("catAdd", {pageTitle:"",
      item:{}
  });
});
router.post('/Add',(req, res) => {
  const modelData = new catModel({
      name:req.body.name
  });
  modelData.save();
  res.redirect("/C/List");
});
router.get('/List',async (req, res) => {
  let cat_data=await catModel.find();
  res.render("catList", {pageTitle:"ניהול קטגוריות",
      data:cat_data
  });
});


router.get('/Edit',async (req, res) => {
  let item_data=await catModel.findById(req.query.id);
  res.render("catAdd", {pageTitle:"עריכת קטיגוריה",
      item:item_data
  });
});
router.post('/Edit',async (req, res) => {
  const modelData = {
  name:req.body.name
  };
  let item_data=await catModel.findByIdAndUpdate(req.query.id,modelData);
  res.redirect("/C/List");
});


router.post('/Delete',async (req, res) => {
  let item_data=await catModel.findByIdAndDelete(req.body.id);
  res.redirect("/C/List");
});
router.put("/api/phase-durations/:id", (req, res) => {
  const { id } = req.params;
  catModel.findByIdAndUpdate(id, req.body)
    .then(result => {
      if (result) {
        res.status(200).json({ message: "successfully updated", result });
      }
    })
    .catch(err => {
      console.error("Error updating item:", id, err);
    });
});

router.get("/api/phase-durations/:id", (req, res) => {
  const { id } = req.params;
  catModel.findById(id)
    .then(result => {
      if (result) {
        res.status(200).json({ message: "successfully retrieved", result });
      }
    })
    .catch(err => {
      console.error("Error retrieving item:", id, err);
    });

});

router.delete("/api/phase-durations/:id", (req, res) => {
  const { id } = req.params;
  catModel.findByIdAndDelete(id)
    .then(result => {
      if (result) {
        res.status(200).json({ message: "successfully deleted", result });
      }
    })
    .catch(err => {
      console.error("Error deleting :", id, err);
    });
});
router.delete("/api/delete-all", (req, res) => {
  catModel.deleteMany({})
    .then(() => {
      res.status(200).json({ message: "All documents deleted successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "An error occurred while deleting documents" });
    });
})

module.exports = router;
