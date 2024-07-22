
import ServerConnections from '../../components/ServerConnections';
import { PluginType } from '../../types/plugin.ts';
import * as userSettings from '../../scripts/settings/userSettings';

class BackdropScreensaver {
    constructor() {
        this.name = 'BackdropScreensaver';
        this.type = PluginType.Screensaver;
        this.id = 'backdropscreensaver';
        this.supportsAnonymous = false;
    }
    show() {
        const query = {
            ImageTypes: 'Backdrop',
            EnableImageTypes: 'Backdrop',
            IncludeItemTypes: 'Movie,Series',
            SortBy: 'Random',
            Recursive: true,
            Fields: 'Taglines, SortName',
            ImageTypeLimit: 10,
            StartIndex: 0,
            Limit: 200
        };

        const apiClient = ServerConnections.currentApiClient();
        apiClient.getItems(apiClient.getCurrentUserId(), query).then((result) => {
            // console.log('results:');
            let i;
            let item;
            for (i = 0; i < result.Items.length; i++) {
                item = result.Items[i];
                // console.log((i + 1) + ':Path:' + item.Path.toString());
                // console.log((i + 1) + ':Name:' + item.Name.toString());
                // console.log((i + 1) + ':ParentId:' + item.ParentId.toString());
                if (item.SortName != '') {
                    item.title = item.SortName;
                }
                if (item.Name != '') {
                    item.title = item.Name;
                }
                if (item.Taglines != '') {
                    item.description = item.Taglines;
                }
            }
            // result.Items.forEach(function(entry) {
            //     console.log(entry.toString());
            // });
            if (result.Items.length) {
                import('../../components/slideshow/slideshow').then(({ default: Slideshow }) => {
                    const newSlideShow = new Slideshow({
                        showTitle: true,
                        cover: true,
                        items: result.Items,
                        autoplay: {
                            delay: userSettings.backdropScreensaverInterval() * 1000
                        }
                    });

                    newSlideShow.show();
                    this.currentSlideshow = newSlideShow;
                }).catch(console.error);
            }
        });
    }

    hide() {
        if (this.currentSlideshow) {
            this.currentSlideshow.hide();
            this.currentSlideshow = null;
        }
        return Promise.resolve();
    }
}

export default BackdropScreensaver;
