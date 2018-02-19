describe('file-upload', () => {
    describe('validation', () => {
        it('should pass validation options to $file service', () => {});
        it('should render accepted file extensions', () => {});
    });

    describe('files selection / drop', () => {
        it('should emit files-ready event when $file managed files change', () => {});
    });

    describe('main actions', () => {
        it('should disable add button when uploading', () => {});
        it('should disable add button when there is no completed file', () => {});
        it('should emit done event when add button is clicked', () => {});
        it('should emit cancel event when cancel button is clicked', () => {});
    });

    describe('uploading', () => {
        it('should render uploading files', () => {});
        it('should emit file-upload-cancel when an uploading file cancel button is clicked', () => {});
    });

    describe('completed', () => {
        it('should render completed files', () => {});
        it('should emit file-remove when a completed file is deleted', () => {});
    });
});
