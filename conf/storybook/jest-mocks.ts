import uuid from '../../src/utils/uuid/uuid';

jest.mock('../../src/utils/uuid/uuid');
(uuid.generate as jest.Mock).mockReturnValue('uuid');
