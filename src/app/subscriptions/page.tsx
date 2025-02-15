import { SubscriptionsList } from "@/components/shared/subscriptionsList";

export default async function Subscriptions() {
    return (
    <div className="mt-[clamp(1.875rem,1.445rem+2.15vw,3.125rem)] mb-[30px] mx-[clamp(0.938rem,calc(-15.104rem+23.33vw),3.125rem)] flex flex-col items-center justify-center flex-1">
        <div className="flex flex-col justify-center max-w-[750px] w-full">
            <SubscriptionsList className="max-w-[clamp(65.625rem,22.569rem+44.44vw,78.125rem)] w-full" /> 
        </div>
    </div>
    );
}