import PropTypes from 'prop-types';

export const googleButtonPropTypes = {
    onSuccess: PropTypes.func.isRequired,
    onError: PropTypes.func,
    isManager: PropTypes.bool,
    useHeaderAuth: PropTypes.bool,
    useGetAuth: PropTypes.bool,
};

export const googleButtonDefaultProps = {
    onError: undefined,
    isManager: false,
    useHeaderAuth: false,
    useGetAuth: false,
};
