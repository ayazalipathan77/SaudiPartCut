-- KSAPartCut Manufacturing Platform Database Schema
-- PostgreSQL 12+

-- Drop existing tables (careful in production!)
DROP TABLE IF EXISTS shape_finishing CASCADE;
DROP TABLE IF EXISTS shape_services CASCADE;
DROP TABLE IF EXISTS shape_thickness CASCADE;
DROP TABLE IF EXISTS shape_materials CASCADE;
DROP TABLE IF EXISTS finishing_options CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS thickness_options CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS shape_parameters CASCADE;
DROP TABLE IF EXISTS shapes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table (Authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shapes Table (Template Definitions)
CREATE TABLE shapes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100),
    
    svg_path_generator TEXT,
    threejs_shape_generator TEXT,
    preview_image_url VARCHAR(500),
    cost_formula TEXT,
    
    is_active BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Shape Parameters Table (Dynamic Form Fields)
CREATE TABLE shape_parameters (
    id SERIAL PRIMARY KEY,
    shape_id INTEGER NOT NULL REFERENCES shapes(id) ON DELETE CASCADE,
    
    parameter_name VARCHAR(100) NOT NULL,
    parameter_type VARCHAR(50) NOT NULL CHECK (parameter_type IN ('number', 'range', 'select', 'boolean')),
    label VARCHAR(255) NOT NULL,
    
    default_value VARCHAR(255),
    min_value DECIMAL(10, 2),
    max_value DECIMAL(10, 2),
    step_value DECIMAL(10, 2) DEFAULT 1,
    unit VARCHAR(20),
    
    options JSONB DEFAULT '[]'::jsonb,
    depends_on VARCHAR(255),
    validation_formula TEXT,
    
    help_text TEXT,
    placeholder TEXT,
    display_order INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(shape_id, parameter_name)
);

-- Materials Table
CREATE TABLE materials (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    material_type VARCHAR(100) NOT NULL,
    
    density DECIMAL(10, 4),
    color_hex VARCHAR(7),
    roughness DECIMAL(3, 2),
    metalness DECIMAL(3, 2),
    
    cost_per_kg DECIMAL(10, 2),
    cost_per_sqm DECIMAL(10, 2),
    
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    description TEXT,
    properties JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Thickness Options Table
CREATE TABLE thickness_options (
    id SERIAL PRIMARY KEY,
    thickness_value DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) DEFAULT 'mm',
    
    cost_multiplier DECIMAL(5, 2) DEFAULT 1.0,
    
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(thickness_value, unit)
);

-- Services Table
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    service_name VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    
    description TEXT,
    
    base_cost DECIMAL(10, 2) DEFAULT 0,
    cost_formula TEXT,
    
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Finishing Options Table
CREATE TABLE finishing_options (
    id SERIAL PRIMARY KEY,
    finish_name VARCHAR(255) NOT NULL,
    finish_type VARCHAR(100) NOT NULL,
    
    description TEXT,
    
    cost_multiplier DECIMAL(5, 2) DEFAULT 1.0,
    cost_per_sqm DECIMAL(10, 2),
    
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mapping Tables

CREATE TABLE shape_materials (
    id SERIAL PRIMARY KEY,
    shape_id INTEGER NOT NULL REFERENCES shapes(id) ON DELETE CASCADE,
    material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    
    is_default BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(shape_id, material_id)
);

CREATE TABLE shape_thickness (
    id SERIAL PRIMARY KEY,
    shape_id INTEGER NOT NULL REFERENCES shapes(id) ON DELETE CASCADE,
    thickness_id INTEGER NOT NULL REFERENCES thickness_options(id) ON DELETE CASCADE,
    
    is_default BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(shape_id, thickness_id)
);

CREATE TABLE shape_services (
    id SERIAL PRIMARY KEY,
    shape_id INTEGER NOT NULL REFERENCES shapes(id) ON DELETE CASCADE,
    service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    
    is_default BOOLEAN DEFAULT false,
    is_required BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(shape_id, service_id)
);

CREATE TABLE shape_finishing (
    id SERIAL PRIMARY KEY,
    shape_id INTEGER NOT NULL REFERENCES shapes(id) ON DELETE CASCADE,
    finishing_id INTEGER NOT NULL REFERENCES finishing_options(id) ON DELETE CASCADE,
    
    is_default BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(shape_id, finishing_id)
);

-- Indexes
CREATE INDEX idx_shapes_is_active ON shapes(is_active);
CREATE INDEX idx_shapes_category ON shapes(category);
CREATE INDEX idx_shape_parameters_shape_id ON shape_parameters(shape_id);
CREATE INDEX idx_materials_is_active ON materials(is_active);
CREATE INDEX idx_thickness_is_active ON thickness_options(is_active);
CREATE INDEX idx_services_is_active ON services(is_active);
CREATE INDEX idx_finishing_is_active ON finishing_options(is_active);

CREATE INDEX idx_shape_materials_shape_id ON shape_materials(shape_id);
CREATE INDEX idx_shape_thickness_shape_id ON shape_thickness(shape_id);
CREATE INDEX idx_shape_services_shape_id ON shape_services(shape_id);
CREATE INDEX idx_shape_finishing_shape_id ON shape_finishing(shape_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shapes_updated_at BEFORE UPDATE ON shapes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shape_parameters_updated_at BEFORE UPDATE ON shape_parameters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_thickness_updated_at BEFORE UPDATE ON thickness_options FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_finishing_updated_at BEFORE UPDATE ON finishing_options FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
