import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

const Heading = ({children, size="md", color="", align=""}) => {
    return (
        <p className={`heading ${size} ${color} ${align}`}>{children}</p>
    )
}

export default Heading

Heading.propTypes = {
    children: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg'])
}

