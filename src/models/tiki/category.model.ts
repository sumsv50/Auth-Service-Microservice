export default class TikiCategory {

    id: Number;
    name: String;
    description: String;
    parent_id: Number;
    is_primary: Boolean;
    is_product_listing_enabled: Boolean;
    no_license_seller_enabled: Boolean;
    parents: Array<any>;

}