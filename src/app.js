import express from "express";
import { create as createHbs } from "express-handlebars";
import multer from "multer";
import { connectMongoDB } from "./db/conn.js";
import { EbookModel } from "./db/model/e-book.model.js";

const multerUploader = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "public/img/e-book");
        },
        filename: function (req, file, cb) {
            const originalName = file.originalname;
            const [name, ext] = originalName.split(".");
            const fileName = `${name}${Date.now()}.${ext}`;
            cb(null, fileName);
        }
    })
});
const app = express();

const hbs = createHbs({
    defaultLayout: "main",
    extname: "hbs",
    layoutsDir: "views/layout",
    partialsDir: "views/partials",
    helpers: {
        eq: (left, right) => {
            return left === right;
        },
    }
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views/pages");

app.use(express.static("public"));
app.use(express.urlencoded());

connectMongoDB();
EbookModel.createCollection();

app.get("/index", (req, res) => {
    res.render("index");
});

app.get("/e-books", async (req, res) => {
    const ebooks = await EbookModel.find().lean();
    res.render("e-books", {
        ebooks
    });
});

app.get("/e-books/add-e-book", (req, res) => {
    res.render("add-e-book");
});

app.post("/e-books/add-e-book", multerUploader.single("image"), async (req, res) => {
    const file = req.file;
    const data = req.body;
    const ebook = new EbookModel({
        name: data.name,
        authorName: data.authorName,
        numPages: data.numberOfPage,
        price: data.price,
        releaseDate: data.releaseDate,
        desc: data.desc,
        imageUrl: `/img/e-book/${file.filename}`
    });
    await ebook.save();

    res.redirect("/e-books");
});

app.get("/e-books/add-e-book/:id", async (req, res) => {
    const id = req.params.id;
    const ebook = await EbookModel.findById(id).lean();
    res.render("add-e-book", {
        ebook,
        isEditing: true
    });
});

app.post("/e-books/add-e-book/:id", multerUploader.single("image"), async (req, res) => {
    const file = req.file;
    const id = req.params.id;
    const data = req.body;

    await EbookModel.updateOne(
        {
            _id: id
        },
        {
            $set: {
                name: data.name,
                authorName: data.authorName,
                numPages: data.numberOfPage,
                price: data.price,
                releaseDate: data.releaseDate,
                desc: data.desc,
                imageUrl: `/img/e-book/${file.filename}`
            }
        }
    );

    res.redirect("/e-books");
});

app.delete("/e-books/:id", async (req, res) => {
    const id = req.params.id;

    await EbookModel.deleteOne({
        _id: id
    });

    res.json({
        status: true
    });
});

app.listen(3000, () => {
    console.log("App is running on port 3000");
});