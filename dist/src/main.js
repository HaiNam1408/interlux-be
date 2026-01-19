"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const admin_module_1 = require("./api/admin/admin.module");
const client_module_1 = require("./api/client/client.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector)));
    app.use(bodyParser.json({ limit: '20mb' }));
    app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
    app.enableCors();
    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    app.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'views'));
    app.setViewEngine('ejs');
    const clientConfig = new swagger_1.DocumentBuilder()
        .addBearerAuth()
        .setTitle('Client API')
        .setDescription('API documentation for client-facing endpoints')
        .setVersion('1.0')
        .addTag('Client')
        .build();
    const clientDocument = swagger_1.SwaggerModule.createDocument(app, clientConfig, {
        include: [client_module_1.ClientModule],
    });
    swagger_1.SwaggerModule.setup('api/docs/client', app, clientDocument);
    const adminConfig = new swagger_1.DocumentBuilder()
        .addBearerAuth()
        .setTitle('Admin API')
        .setDescription('API documentation for admin-facing endpoints')
        .setVersion('1.0')
        .addTag('Admin')
        .build();
    const adminDocument = swagger_1.SwaggerModule.createDocument(app, adminConfig, {
        include: [admin_module_1.AdminModule],
    });
    swagger_1.SwaggerModule.setup('api/docs/admin', app, adminDocument);
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map