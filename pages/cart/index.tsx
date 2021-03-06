import { getCart, getCartTotal, checkCartValidity } from "../../utils/cart";
import { GetStaticProps } from 'next'
import Link from "next/link";
import { useState, useEffect } from "react";



// Components
import CartItem from "../../components/CartItem/CartItem";
import Section from "../../components/Section/Section";
import Layout from "../../components/Layout/Layout";
import Checkout from "../../components/Checkout/Checkout";

// Styles
import styles from "../../styles/pages/cart/index.module.scss";

export default function Cart({ products, shopSettings }) {
    checkCartValidity(products)
    // State
    const [loading, setLoading] = useState(true)
    const [cart, setCart] = useState(getCart());
    const [showCart, setShowCart] = useState(true);
    const [total, setTotal] = useState(getCartTotal());


    // Hydrate Cart
    useEffect(() => {
        setLoading(false)
    }, [])


    // Helpers
    const getProduct = (item) => {
        let product = products.find(product => product.id === item.id);
        return product
    }

    // Handlers
    const handleCartChange = (() => {
        setCart(getCart())
        setTotal(getCartTotal())

    })

    const handleCheckoutShow = () => {
        // Check Quants
        setShowCart(false)
        handleCartChange();
    }

    const handleCartShow = () => {
        setShowCart(true)
    }


    // Components
    const CartItemGrid = () => {
        if (!loading) {
            return (
                <>
                    <div className={styles.items}>
                        {!cart || cart.length < 1 ?
                            <p>Your Cart is Empty :(</p>
                            : cart.map((item, index) => (
                                <CartItem
                                    item={item}
                                    product={getProduct(item)}
                                    key={index}
                                    handleCartChange={() => handleCartChange()} />
                            ))
                        }
                    </div>
                </>
            )
        }
        return null
    }

    const Options = () => {
        if (showCart) {
            return (
                <div className={styles.options}>
                    <button className="button button--border">
                        <Link href="/shop">
                            <a>Back to Shop</a>
                        </Link>
                    </button>
                    {!cart || cart.length < 1 ?
                        null
                        : <button className="button" onClick={() => handleCheckoutShow()}>
                            <p>Checkout</p>
                        </button>
                    }
                </div>
            )
        } else {
            return (
                <div className={styles.options}>
                    <button className="button button--border" onClick={() => handleCartShow()}>
                        <a>Back to Cart</a>
                    </button>
                </div>
            )
        }
    }

    return (
        <Layout
            head={{
                title: "Cart | C-DOC",
                description: "",
                canonical: "/cart",
                robots: false
            }}
            noLanding={true}
            shop={true}
        >
            <Section
                heading="Your Cart"
                noCross={true}
                classNameProp={styles.cart}
            >
                {!loading ?
                    <div className={styles.grid}>
                        {showCart ? <CartItemGrid /> : <Checkout shopSettings={shopSettings} total={total} products={products} />}
                        <Options />
                    </div>
                    : null}
            </Section>
        </Layout >
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const productResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
    const products = await productResponse.json();

    const settingsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shopSettings`);
    const shopSettings = await settingsResponse.json();

    return {
        props: {
            products,
            shopSettings
        },
    }
}

