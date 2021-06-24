/**
 * create express server
 */
const express = require( "express" )

/**
 * for the mongoDB connection
 */
const mongoose = require( "mongoose" )

/**
 * MongoDB Collection: Article
 */
const Article = require( "./models/article" )

/**
 * routes for article
 */
const articleRouter = require( "./routes/articles" )



/**
 * Create a new middleware function to override the req.method property with a new value.
 * It is very important that this module is used before any module that needs to know the method of the request (for example, it must be used prior to the csurf module).
 */
//Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
//We did the DELETE Button in a form because google scrolles the site and clicks every link. SO it is not possible to use a link!!!! Instead you use a form with a button inside. Becuase you obly can use GET and POST in a form, we use methodOverride
const methodOverride = require( "method-override" )


/**
 * create express server
 */
const app = express();







/**
 * connect with mongoDB
 */
mongoose.connect( "mongodb://localhost/blog", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true } )

/**
 * change view engine
 */
app.set( "view engine", "ejs" )


/**
 * we use a form and input via post: put this above the "app.use( " / articles", articleRouter )"
 */
app.use( express.urlencoded( { extended: false } ) )

//It is very important that this module is used before any module that needs to know the method of the request (for example, it must be used prior to the csurf module).
app.use( methodOverride( "_method" ) )

//add router from module with a new path.
app.use( "/articles", articleRouter );


/**
 * change view folder
 */
app.set( "views", __dirname + "/notview" )

/**
 * ROUTES
 */
app.get( "/", async ( req, res ) => {
    //OLD VERSION
    //     const articles = [{
    //         title: "Test Article",
    //         date: new Date().toLocaleDateString(),
    //         description: "Lorem",
    // 
    //     }, {
    //         title: "Test Article 2",
    //         date: new Date().toLocaleDateString(),
    //         description: "Lorem sdf sdfsdf sdf s df sdfsdf sg f hg jhi kk jfgd gs d as",
    // 
    //     }]

    // get all Articles from mongoDB, sorted by date 
    const articles = await Article.find( {} ).sort( [['date', -1]] )

    //shie index.ejs with data from articles
    res.render( "articles/index", { articles: articles } )
} )


app.listen( 3001, () => { console.log( "connected to db" ); } )