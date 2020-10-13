from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.conf import settings

from jssocialauth.views import TokenPopView, CurrentUserView



urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'schemo.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url('', include('social.apps.django_app.urls', namespace='social')),
    url(r'^popuptoken/$', TokenPopView.as_view(), name="popuptoken"),
    url(r'^me/$', CurrentUserView.as_view(), name="me"),

    url(r'^admin/', include(admin.site.urls)),

)


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    #urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


if settings.DEBUG:
    import debug_toolbar
    urlpatterns += patterns('',
        url(r'^__debug__/', include(debug_toolbar.urls)),
    )