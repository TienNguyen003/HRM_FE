import PropTypes from 'prop-types';

function Menu({ classG, children }) {
    return <nav className={classG}>{children}</nav>;
}

Menu.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Menu;