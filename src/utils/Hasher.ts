import bcryptjs from 'bcryptjs';

const Hasher = async (str: string) => {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(str, salt);
};

export default Hasher;