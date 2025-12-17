<script lang="ts">
</script>

<div class="relative">
    <img src="/bg-1.png" alt="scandinava collection">
    <div class="flex flex-col p-10 justify-between w-[643px] h-[443px] bg-card-bg absolute top-[165px] right-[60px] rounded-xl">
        <div class="flex flex-col pt-6 gap-3">
            <p class="font-primary font-semibold tracking-[3px] text-base text-tertiary">
                New Arrival
            </p>
            <p class="font-primary font-bold text-[52px] leading-16 text-secondary">
                Discover Our<br> New collection
            </p>
            <p class="font-primary font-medium text-lg leading-6 text-tertiary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
                tellus, luctus nec ullamcorper mattis.
            </p>
        </div>
        <a href="/"
           class="flex items-center justify-center pl-6 pr-6 bg-secondary h-[74px] w-[222px] text-white font-primary font-bold text-base">
            BUY NOW
        </a>
    </div>
</div>

<section class="flex flex-col items-center m-12">
    <h2 class="font-primary font-bold text-[32px]">
        Browse The Range
    </h2>
    <p class="font-primary font-normal text-xl mb-12 text-some-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </p>
    <div class="flex gap-5">
        {#snippet figure(url: string, alt: string, caption: string)}
            <figure class="flex flex-col gap-7 items-center">
                <img src="/furniture/{url}" {alt}
                     class="w-[381px] h-[481px] object-cover object-left rounded-xl">
                <figcaption class="font-primary font-semibold text-2xl">
                    {caption}
                </figcaption>
            </figure>
        {/snippet}
        {@render figure("image%20106.png", "dinner room", "Dining")}
        {@render figure("image%20100.png", "living room", "Living")}
        {@render figure("image%20101.png", "bedroom room", "Bedroom")}
    </div>
</section>

<section class="flex flex-col gap-8 items-center">
    <h2 class="font-primary font-bold text-[40px]">Our Products</h2>
    <div class="grid grid-cols-4 gap-8 grid-rows-2">
        {#snippet card(obj: Object)}
            <div class="flex flex-col w-[285px] h-[446px] {obj.tag ? 'relative' : ''}">
                <img src={obj.src} alt={obj.alt} width="285" height="301">
                <div class="flex-1 flex flex-col justify-between p-4 bg-light-bg pb-8">
                    <h4 class="font-primary font-semibold text-2xl">{obj.title}</h4>
                    <p class="font-primary font-light text-base text-gray-3">{obj.description}</p>
                    <div class="flex justify-between items-center">
                        <p class="font-primary font-semibold text-xl">{obj.price}</p>
                        {#if obj.old_price}
                            <p class="font-primary font-medium text-base text-gray-4 line-through">{obj.old_price}</p>
                        {/if} </div> </div>
                {#if obj.tag}
                    <div class="absolute top-5 right-5 flex justify-center items-center size-12 rounded-full {obj.tag.type === 'new' ? 'bg-green-400' : 'bg-red-400'} text-white font-primary font-medium text-base">
                        {obj.tag.value}
                    </div>
                {/if}
            </div>
        {/snippet}
        {@render card({
            title: "Slytherine",
            description: "stylish cafe chair",
            price: "Rp 2.500.000",
            old_price: "Rp 3.500.000",
            src: "/products/1.png",
            alt: "a slytherin product",
            tag: {
                value: "-30%",
                type: "discount",
            }
        })}
        {@render card({
            title: "Leviosa",
            description: "stylish cafe chair",
            price: "Rp 2.500.000",
            src: "/products/2.png",
            alt: "a leviosa product"
        })}
        {@render card({
            title: "Lolita",
            description: "Luxury big sofa",
            price: "Rp 7.000.000",
            old_price: "Rp 14.000.000",
            src: "/products/3.png",
            alt: "a lolita product",
            tag: {
                value: "-50%",
                type: "discount",
            }
        })}
        {@render card({
            title: "Respira",
            description: "Oltdoor bar table and stool",
            price: "Rp 500.000",
            src: "/products/5.png",
            alt: "a slytherin product",
            tag: {
                value: "New",
                type: "new",
            }
        })}
        {@render card({
            title: "Grifo",
            description: "Night lamp",
            price: "Rp 1.500.000",
            src: "/products/9.png",
            alt: "a slytherin product"
        })}
        {@render card({
            title: "Muggo",
            description: "Small mug",
            price: "Rp 150.000",
            src: "/products/10.png",
            alt: "a slytherin product",
            tag: {
                value: "New",
                type: "new",
            }
        })}
        {@render card({
            title: "Pingky",
            description: "Cute bed set",
            price: "Rp 7.000.000",
            old_price: "Rp 14.000.000",
            src: "/products/11.png",
            alt: "a slytherin product",
            tag: {
                value: "-50%",
                type: "discount",
            }
        })}
        {@render card({
            title: "Potty",
            description: "Minimalist flower pot",
            price: "Rp 500.000",
            src: "/products/12.png",
            alt: "a slytherin product",
            tag: {
                value: "New",
                type: "new",
            }
        })}

    </div>
    <a href="/" class="w-[245px] h-12 border-1 font-primary font-semibold text-base text-primary border-primary flex justify-center items-center">Show More</a>

</section>