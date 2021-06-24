/**
 * Here you can find all Routes for the articles. 
 * - Add new article
 * - delete article
 * - edit article
 */

/**
 * express server
 */
const express = require( "express" )

/**
 * Create Routes, which are exported at the end of file
 */
const router = express.Router()

/**
 * get Data from mongoDB
 */
const Article = require( "./../models/article" )

/**
 * Show page where you can add a new Article / new.ejs
 */
router.get( "/new", ( req, res ) => {
    // show new.ejs
    res.render( "articles/new", { article: new Article() } );
} )

// WITHOUT SLUG
// router.get( "/:id", async ( req, res ) => {
//     const { id } = req.params;
//     const article = await Article.findById( id )
//     console.log( article );
//     if ( article === null ) res.redirect( "/" )
//     res.render( "articles/show", { article: article } )
// } )


/**
 * show the clicked article on a new page
 */
// WITH SLUG
router.get( "/:slug", async ( req, res ) => {
    //get specific article working with package slug
    const article = await Article.findOne( { slug: req.params.slug } )
    // if no article found, show main page
    if ( article === null ) res.redirect( "/" )
    //if found article by slug (title) show it on a page
    res.render( "articles/show", { article: article } )
} )


/**
 * Edit your choosen article
 */
router.get( "/edit/:id", async ( req, res ) => {
    //get the article by id
    const article = await Article.findById( req.params.id )
    //show edit page with the data from article
    res.render( "articles/edit", { article: article } );
} )


/**
 * send new article via  from form new.ejs via POST
 */
router.post( "/", async ( req, res, next ) => {
    req.article = new Article();
    next()
    // let article = new Article( {
    //     title: req.body.title,
    //     markdown: req.body.markdown,
    //     description: req.body.description
    // } )
    // try {
    //     article = await article.save()
    //     console.log( article );
    //     res.redirect( `/articles/${article.slug}` )
    // } catch ( err ) {
    //     console.log( err );
    //     res.render( "articles/new", { article: article } )
    // }

    //its like a middleware
}, saveArticleAndRedirect( "new" ) )


/**
 * Update Edit an article see edit.ejs
 */
router.put( "/:id", async ( req, res, next ) => {
    req.article = await Article.findById( req.params.id )
    next()

}, saveArticleAndRedirect( "edit" ) )
//above is a middelware

/**
 * delete an article
 */
router.delete( "/:id", async ( req, res ) => {
    await Article.findByIdAndDelete( req.params.id )
    res.redirect( "/" )
} )


/**
 * 
 * @param {String} path 
 * @returns Responste whitch creates an article depends on req path.
 */
function saveArticleAndRedirect( path ) {
    return async ( req, res ) => {
        //creat article
        let article = req.article

        article.title = req.body.title
        article.markdown = req.body.markdown
        article.description = req.body.description

        try {
            //save
            article = await article.save()
            console.log( article );
            res.redirect( `/articles/${article.slug}` )
        } catch ( err ) {
            console.log( err );
            //new page
            res.render( `articles/${path}`, { article: article } )
        }

    }
}

module.exports = router;