#registered routes list

def routes_list(app):

    from .routes.generate_code import generate_code
    app.register_blueprint(generate_code, url_prefix='/')

    #put routes here