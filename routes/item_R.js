const express = require('express');
const router = express.Router();


router.get('/Add',(req, res) => {

  res.render("itemAdd", {pageTitle:" ",
      item:{}
  });
});
router.post('/Add',(req, res) => {
  const modelData = new catitem({
      name:req.body.name,
      catg:req.body.catg
  });
  modelData.save();
  res.redirect("/P/List");
});

module.exports = router;
