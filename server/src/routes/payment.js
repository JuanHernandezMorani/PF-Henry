const { Router } = require("express");
const mercadopago = require("mercadopago");
const { Sales, Ownership, User } = require("../db.js");
const ACCES_TOKEN =
  "TEST-7893132721883360-101817-34c31b28ae790652f296a05af3cf9adf-1078900971";

mercadopago.configure({
  access_token: ACCES_TOKEN,
});

const router = Router();
// let paymentId = '';

router.post("/", async (req, res) => {
  const product = req.body;
  console.log(product);
  try {
    const response = await mercadopago.preferences.create(product);
    // console.log(response);
    const productId = response.body.id;
    res.send({ productId });
  } catch (e) {
    console.log(e.message);
  }
});

router.post('/paymentId/:id/:idUser', async (req, res) => {
    const body = req.body;
    const ownershipId = parseInt(req.params.id);
    const idUser = req.params.idUser;
    try {
        console.log(body);
        if(body.data){
            let paymentId = body.data.id;
            console.log(paymentId);
            const ownership = await Ownership.findOne({where: {id: ownershipId}});
            const user = await User.findOne({where: {id: idUser}});
            if(ownership){
                const newSale = await Sales.create({
                    name: 'Pending...',
                    paymentId,
                    state: 'pending',
                    state_detail: 'pending'
                });
                // console.log(newSale);
                // const ownershipNewSale = await ownership.addSales({
                //     name: newSale.dataValues.name,
                //     paymentId: newSale.dataValues.paymentId,
                //     state: newSale.dataValues.state,
                //     state_detail: newSale.dataValues.state_detail,
                // });
                // console.log(ownershipNewSale);
                const ownershipNewSale = await newSale.addOwnership(ownership.id);
                const userSale = await user.addSales(newSale.id);
                console.log(await User.findOne({where: {id: user.id}, include:{ model: Sales}}));
            }
            return res.send('Ok, me estás pasando la data, seguí asi...');
        };
        return res.status(400).send('No me estás pasando la data...');
    } catch (error) {
        console.log(error);
    };
});

router.get('/paymentId/:id/:userId', async (req, res) => {
    const ownershipId = req.params.id;
    const userId = req.params.userId;
    console.log(ownershipId);
    try {
        // const response = await Ownership.findOne({
        //     where: {id: ownershipId},
        //     include: {
        //         model: Sales,
        //         attributes: ['paymentId'],
        //         through: {
        //             attributes: []
        //         }
        //     }
        // });
        // console.log(response);
        const sales = await Sales.findAll({include: {model: Ownership, where: {id: ownershipId}}});
        console.log(sales);
        const paymentId = sales[0].dataValues.paymentId;
        const user = await User.findOne({where: {id: userId}, include: {model: Sales}});
        // const ownership = sales.
        res.send(paymentId);
    } catch (error) {
        console.log(error);
    };
});

router.put("/editSale", async (req, res) => {
  const { state, state_detail, paymentId } = req.body;
  console.log(state, state_detail, paymentId);
  try {
    const sale = await Sales.findAll({where: {paymentId: `${paymentId}`}});
    console.log(sale);
    if(sale.length){
      const updatedSale = await sale[0].update(
        {
          name: "wow",
          state: state,
          state_detail: state_detail,
        }
      );
      return res.send("Venta actualizada!");
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send("Ha ocurrido un error, la venta no pudo ser actualizada...");
  }
});

router.get("/getSales/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);
  console.log(userId);
  try {
    if(userId) {
      const sale = await Sales.findAll({
        include: [
          {
            model: Ownership,
          },
          {
            model: User,
            where: {
              id: userId,
            },
          },
        ],
      });
      return res.send(sale);
    }
    console.log('no entró al if');
    const sales = await Sales.findAll({include: [{model: Ownership}, {model: User}]});
    return res.send(sales);
  } catch (error) {
    console.log(error);
  }
});

router.post("/createSales/:id/:userId", async (req, res) => {
  const body = req.body;
  const propId = parseInt(req.params.id);
  const userId = req.params.userId;
  try {
    if (body.data) {
      let paymentId = body.data.id;
      console.log(paymentId);
      const ownership = await Ownership.findOne({ where: { id: propId } });
      const user = await User.findOne({where: {id: userId}});
      if (ownership && user) {
        const newSale = await Sales.create({
          name: "Pending...",
          paymentId,
          state: "pending",
          state_detail: "pending",
        });
        const ownershipNewSale = await newSale.addOwnership(ownership.id);
        const userSale = await user.addSales(newSale.id);
        console.log(await User.findOne({where: {id: user.id}, include:{ model: Sales}}));
        // const ownershipNewSale = await newSale.addOwnership(ownership.id);
        // console.log(ownershipNewSale);
      }
      return res.send("Ok, me estás pasando la data, seguí asi...");
    }
    return res.status(400).send("No me estás pasando la data...");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
