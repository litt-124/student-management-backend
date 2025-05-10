'use strict';

const path = require("path");
const MANAGER = require(path.join(process.cwd(), 'MANAGER')).getInstance();
const AbstractRoute = require(path.join(MANAGER.getRoutesDir(), 'AbstractRoute'));
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Assignment Management API',
            version: '1.0.0',
            description: 'API documentation for Assignment Management API.',
        },
    },
    apis: [MANAGER.getActionsDir() + '/*/*.js', MANAGER.getActionsDir() + '/*.js', MANAGER.getRoutesDir() + '/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthorizationParameter:
 *       in: header
 *       name: authorization
 *       description: User Token
 *       required: true
 *       schema:
 *         type: string
 *     StatusParameter:
 *       in: query
 *       name: status
 *       description: Status field
 *       required: true
 *       schema:
 *         type: string
 *     SearchParameter:
 *       in: query
 *       name: searchText
 *       description: Search text to list items
 *       required: false
 *       schema:
 *         type: string
 *     OffsetParameter:
 *       in: query
 *       name: offset
 *       description: Starting from
 *       required: true
 *       schema:
 *         type: string
 *     LimitParameter:
 *       in: query
 *       name: limit
 *       description: How  many items should be returned
 *       required: true
 *       schema:
 *         type: string
 *     UserIdParameter:
 *       in: path
 *       name: userId
 *       description: The user id parameter in the URL path
 *       required: true
 *       schema:
 *         type: string
 */
class SwaggerRouter extends AbstractRoute {

    /**
     * @returns {string}
     */
    getPrefix() {
        return "/swagger";
    }


    setActions() {
        this.router.use('/api-docs', swaggerUi.serve);
        this.router.get('/api-docs', (req, res, next) => {
            res.type('html');
            next();
        }, swaggerUi.setup(swaggerSpec));
    }
}

module.exports = new SwaggerRouter();