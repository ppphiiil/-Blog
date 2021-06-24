const mongoose = require( "mongoose" )

/**
 * convert markdown to html
 */
const marked = require( "marked" )

/**
 * used that we dont see an id in the url. So we see the title in the url
 */
const slugify = require( "slugify" )

/**
 * creates an html in node
 */
const createDomPurify = require( "dompurify" )

/**
 *  is needed for dompurify
 */
const { JSDOM } = require( "jsdom" )

/**
 * senetize our html
*/
const dompurify = createDomPurify( new JSDOM().window )

/**
 * SCHEMA article
 */
const articleSchema = new mongoose.Schema( {
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    markdown: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    // so you see the title in the url instead of the id
    slug: {
        type: String,
        required: true,
        unique: true
    },
    // htmlversion of our markdown
    sanitizedHtml: {
        type: String,
        required: true
    }
} )

/**
 * Middleware
 */
articleSchema.pre( "validate", function ( next ) {
    //if there is an title use it for the url
    if ( this.title ) {
        this.slug = slugify( this.title, { lower: true, strict: true } )
    }
    //if ther is markdown than transform it to html
    if ( this.markdown ) {
        this.sanitizedHtml = dompurify.sanitize( marked( this.markdown ) )
    }
    // dont forget the next!!!!
    next()
} )

//creat a collection called Article
module.exports = mongoose.model( "Article", articleSchema )