import React, { useState } from "react";
import { action } from "@storybook/addon-actions";

import {
    PayPalScriptProvider,
    usePayPalCardFields,
    PayPalCardFieldsProvider,
    PayPalCardFieldsForm,
} from "../../index";
import {
    getOptionsFromQueryString,
    generateRandomString,
    CREATE_ORDER_URL,
    CAPTURE_ORDER_URL,
} from "../utils";
import { COMPONENT_TYPES, ORDER_ID, ERROR } from "../constants";
import { getFormCode } from "./code";
import DocPageStructure from "../components/DocPageStructure";

import type { FC } from "react";
import type {
    CardFieldsOnApproveData,
    PayPalScriptOptions,
} from "@paypal/paypal-js";
import type { StoryFn } from "@storybook/react";
import type { DocsContextProps } from "@storybook/addon-docs";

const uid = generateRandomString();
const scriptProviderOptions: PayPalScriptOptions = {
    clientId:
        "AduyjUJ0A7urUcWtGCTjanhRBSzOSn9_GKUzxWDnf51YaV1eZNA0ZAFhebIV_Eq-daemeI7dH05KjLWm",
    components: "card-fields",
    ...getOptionsFromQueryString(),
};
const CREATE_ORDER = "createOrder";
const SUBMIT_FORM = "submitForm";
const CAPTURE_ORDER = "captureOrder";

const description = `
The \`usePayPalCardFields\` custom hook provides access to the state managed by \`<PayPalCardFieldsProvider />\`.
`;

/**
 * Functional component to submit the hosted fields form
 */

const SubmitPayment: React.FC<{
    isPaying: boolean;
    setIsPaying: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isPaying, setIsPaying }) => {
    const { cardFieldsForm } = usePayPalCardFields();

    const handleClick = async () => {
        if (!cardFieldsForm) {
            const childErrorMessage =
                "Unable to find any child components in the <PayPalHostedFieldsProvider />";

            action(ERROR)(childErrorMessage);
            throw new Error(childErrorMessage);
        }
        const formState = await cardFieldsForm.getState();

        if (!formState.isFormValid) {
            return alert("The payment form is invalid");
        }
        action(SUBMIT_FORM)("Form is valid and submitted");
        setIsPaying(true);

        cardFieldsForm.submit().catch((err) => {
            action(ERROR)(err.message);
            setIsPaying(false);
        });
    };

    return (
        <button
            className={`btn${isPaying ? "" : " btn-primary"}`}
            style={{ float: "right" }}
            onClick={handleClick}
        >
            {isPaying ? <div className="spinner tiny" /> : "Pay"}
        </button>
    );
};

export default {
    title: "PayPal/PayPalCardFields/Custom Hooks",
    // component: usePayPalCardFields,
    parameters: {
        controls: { expanded: true, sort: "requiredFirst" },
        docs: {
            source: { language: "tsx" },
            description: {
                component: description,
            },
        },
    },
    argTypes: {
        cardFieldsForm: {
            control: false,
            table: {
                category: "State",
                type: { summary: "PayPalCardFieldsComponent" },
            },
            description:
                "Refers to the CardFields instance generated by the &lt;PayPalCardFieldsProvider /&gt;.",
        },
        fields: {
            control: false,
            table: {
                category: "State",
                type: {
                    summary:
                        "Record<FieldComponentName, PayPalCardFieldsIndividualField>",
                },
            },
            description:
                "An object containing the reference for each field rendered.",
        },
        FieldComponentName: {
            control: false,
            type: { required: false },
            description: `<code>"CVVField" | "ExpiryField" | "NumberField" | "NameField"</code>
            `,
            table: { category: COMPONENT_TYPES },
        },
        PayPalCardFieldsIndividualField: {
            control: false,
            type: { required: false },
            description: `<code>{<br>
                <b class="code-json">render</b>: (container: string | HTMLElement) => Promise&lt;void&gt; <br>
                <b class="code-json">addClass</b>: (className: string) => Promise&lt;void&gt; <br>
                <b class="code-json">clear</b>: () => void; <br>
                <b class="code-json">focus</b>: () => void; <br>
                <b class="code-json">removeAtrribute</b>: (name: "aria-invalid" | "aria-required" | "disabled" | "placeholder") => Promise&lt;void&gt; <br>
                <b class="code-json">removeClass</b>: (className: string) => Promise&lt;void&gt; <br>
                <b class="code-json">setAttribute</b>: (name: string, value: string) => Promise&lt;void&gt; <br>
                <b class="code-json">setMessage</b>: (message: string) => void <br>
                <b class="code-json">close</b>: () => Promise&lt;void&gt; <br>
            }</code>
            `,
            table: { category: COMPONENT_TYPES },
        },
        PayPalCardFieldsComponent: {
            control: false,
            type: { required: false },
            description: `<code>{<br>
                <b class="code-json">getState</b>: () => Promise&lt;PayPalCardFieldsStateObject&gt; <br>
                <b class="code-json">isEligible</b>: () => boolean <br>
                <b class="code-json">submit</b>: () => Promise&lt;void&gt; <br>
            }</code>
            `,
            table: { category: COMPONENT_TYPES },
        },
        PayPalCardFieldsStateObjectFields: {
            control: false,
            type: { required: false },
            description: `<code>{<br>
                    <b class="code-json">cardCvvField</b>: <b>PayPalCardFieldCardFieldData</b> <br>
                    <b class="code-json">cardNumberField</b>: <b>PayPalCardFieldCardFieldData</b> <br>
                    <b class="code-json">cardNameField</b>: <b>PayPalCardFieldCardFieldData</b> <br>
                    <b class="code-json">cardExpiryField</b>: <b>PayPalCardFieldCardFieldData</b> <br>
                }</code>
            `,
            table: { category: COMPONENT_TYPES },
        },
        PayPalCardFieldsStateObject: {
            control: false,
            type: { required: false },
            description: `<code>{<br>
                <b class="code-json">cards</b>: <b>PayPalCardFieldsCardObject</b>[] <br>
                <b class="code-json">emittedBy</b>?: "name" | "number" | "cvv" | "expiry" <br>
                <b class="code-json">isFormValid</b>: boolean <br>
                <b class="code-json">errors</b>: <b>PayPalCardFieldError</b>[] <br>
                <b class="code-json">fields</b>: <b>PayPalCardFieldsStateObjectFields</b><br>
            }</code>
            `,
            table: { category: COMPONENT_TYPES },
        },
        PayPalCardFieldsCardObject: {
            control: false,
            type: { required: false },
            description: `<code>{<br>
                <b class="code-json">code</b>: <b>PayPalCardFieldSecurityCode</b> <br>
                <b class="code-json">niceType</b>: string  <br>
                <b class="code-json">type</b>: "american-express" | "diners-club" | "discover" | "jcb" | "maestro" | "mastercard" | "unionpay" | "visa" | "elo" | "hiper" | "hipercard" <br>
            }</code>
            `,
            table: { category: COMPONENT_TYPES },
        },
        PayPalCardFieldError: {
            control: false,
            type: { required: false },
            description: `<code>"INELIGIBLE_CARD_VENDOR" | "INVALID_NAME" | "INVALID_NUMBER" | "INVALID_EXPIRY" | "INVALID_CVV" </code>
            `,
            table: { category: COMPONENT_TYPES },
        },
        PayPalCardFieldSecurityCode: {
            control: false,
            type: { required: false },
            description: `<code>{<br>
                <b class="code-json">code</b>: string <br>
                <b class="code-json">size</b>: number  <br>
            }</code>
            `,
            table: { category: COMPONENT_TYPES },
        },
        PayPalCardFieldCardFieldData: {
            control: false,
            type: { required: false },
            description: `<code>{<br>
                <b class="code-json">isFocused</b>: boolean <br>
                <b class="code-json">isEmpty</b>: boolean  <br>
                <b class="code-json">isValid</b>: boolean  <br>
                <b class="code-json">isPotentiallyValid</b>: boolean  <br>
            }</code>
            `,
            table: { category: COMPONENT_TYPES },
        },
    },
};

export const Default: FC = () => {
    const [isPaying, setIsPaying] = useState(false);
    async function createOrder() {
        action(CREATE_ORDER)("Start creating the order in custom endpoint");
        return fetch(CREATE_ORDER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cart: [
                    {
                        sku: "1blwyeo8",
                        quantity: 2,
                    },
                ],
            }),
        })
            .then((response) => response.json())
            .then((order) => {
                action(CREATE_ORDER)(order);
                return order.id;
            })
            .catch((err) => {
                action(ERROR)(err.message);
                console.error(err);
            });
    }

    function onApprove(data: CardFieldsOnApproveData) {
        action(`Received ${ORDER_ID}`)(data.orderID);
        action(CAPTURE_ORDER)(
            `Sending ${ORDER_ID} to custom endpoint to capture the payment information`
        );
        fetch(CAPTURE_ORDER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderID: data.orderID }),
        })
            .then((response) => response.json())
            .then((data) => {
                action(CAPTURE_ORDER)(data);
                setIsPaying(false);
            })
            .catch((err) => {
                action(ERROR)(err.message);
            });
    }
    return (
        <PayPalScriptProvider
            options={{
                ...scriptProviderOptions,
                dataNamespace: uid,
                dataUid: uid,
            }}
        >
            <PayPalCardFieldsProvider
                createOrder={createOrder}
                onApprove={onApprove}
                onError={(err) => {
                    console.log(err);
                }}
            >
                <PayPalCardFieldsForm />
                {/* Custom client component to handle card fields submit */}
                <SubmitPayment isPaying={isPaying} setIsPaying={setIsPaying} />
            </PayPalCardFieldsProvider>
        </PayPalScriptProvider>
    );
};

/********************
 * OVERRIDE STORIES *
 *******************/
(Default as StoryFn).parameters = {
    docs: {
        container: ({ context }: { context: DocsContextProps }) => (
            <DocPageStructure context={context} code={getFormCode()} />
        ),
    },
};