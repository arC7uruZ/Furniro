<script lang="ts">
</script>

<div class="relative">
    <img src="/bg-1.png" alt="scandinava collection">
    <div class="flex flex-col p-10 justify-between w-[643px] h-[443px] bg-primary absolute top-[165px] right-[60px] rounded-xl">
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
        {#snippet figure(image_source: String, img_caption: String)}
            <figure class="flex flex-col gap-7 items-center">
                <img src="/furniture/{image_source}" alt=""
                     class="w-[381px] h-[481px] object-cover object-left rounded-xl">
                <figcaption class="font-primary font-semibold text-2xl">
                    {img_caption}
                </figcaption>
            </figure>
        {/snippet}
        {@render figure("image%20106.png", "Dining")}
        {@render figure("image%20100.png", "Living")}
        {@render figure("image%20101.png", "Bedroom")}
    </div>
</section>